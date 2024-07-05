package com.dg.deukgeun.entity;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.dto.user.UserSignUpDTO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    // @id는 이 필드가 엔티티의 기본 키(primary key)임을 나타냅니다.
    // 고유성: id는 데이터베이스 내에서 해당 엔티티의 유일한 값으로 작동하여, 다른 모든 엔티티와 구별되게 함
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private String detailAddress;
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = true)
    private UserImage userImage;

    public User(UserSignUpDTO dto) {
        this.userId = dto.getUserId();
        this.userName = dto.getUserName();
        this.email = dto.getEmail();
        this.address = dto.getAddress();
        this.detailAddress = dto.getDetailAddress();
        this.role = dto.getRole();
        this.password = dto.getPassword();
    }

}

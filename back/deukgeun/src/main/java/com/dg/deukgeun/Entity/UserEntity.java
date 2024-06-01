package com.dg.deukgeun.Entity;

import com.dg.deukgeun.dto.user.SignUpDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    //@id는 이 필드가 엔티티의 기본 키(primary key)임을 나타냅니다.
    // 고유성: id는 데이터베이스 내에서 해당 엔티티의 유일한 값으로 작동하여, 다른 모든 엔티티와 구별되게 함
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private String category;
    private String password;
    private Integer approval;


    public UserEntity(SignUpDTO dto){
        this.userId = dto.getUserId();
        this.userName = dto.getUserName();
        this.email = dto.getEmail();
        this.address = dto.getAddress();
        this.category = dto.getCategory();
        this.password = dto.getPassword();
        this.approval = dto.getApproval();
    }
    // @Enumerated(EnumType.STRING)
    // private UserRole role;

    // public static UserEntity toUserEntity(UserDTO userDTO) {
    //     UserEntity userEntity = new UserEntity();
    //     userEntity.setUserId(userDTO.getUserId());
    //     userEntity.setUserName(userDTO.getUserName());
    //     userEntity.setEmail(userDTO.getEmail());
    //     userEntity.setAddress(userDTO.getAddress());
    //     userEntity.setCategory(userDTO.getCategory());
    //     userEntity.setPassword(userDTO.getPassword());
    //     userEntity.setApproval(userDTO.getApproval());
        
    //     return userEntity;
    // }
}
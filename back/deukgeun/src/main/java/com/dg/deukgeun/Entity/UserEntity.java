package com.dg.deukgeun.Entity;

import com.dg.deukgeun.dto.UserDTO;
import com.dg.deukgeun.dto.UserRole;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private String category;
    private String password;
    private Integer approval;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public static UserEntity toUserEntity(UserDTO userDTO) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(userDTO.getUserId());
        userEntity.setUserName(userDTO.getUserName());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setAddress(userDTO.getAddress());
        userEntity.setCategory(userDTO.getCategory());
        userEntity.setPassword(userDTO.getPassword());
        userEntity.setApproval(userDTO.getApproval());
        
        return userEntity;
    }
}
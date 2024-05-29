package com.dg.deukgeun.dto;

import com.dg.deukgeun.Entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserDTO {
    private Long id;
    private int userId;
    private String userName;
    private String email;
    private String address;
    private String category;
    private String password;
    private int approval;

    public static UserDTO toUserDTO(UserEntity userEntity){
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(userEntity.getUserId());
        userDTO.setUserName(userEntity.getUserName());
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setAddress(userEntity.getAddress());
        userDTO.setCategory(userEntity.getCategory());
        userDTO.setPassword(userEntity.getPassword());
        userDTO.setApproval(userEntity.getApproval());

        return userDTO;
    }
}

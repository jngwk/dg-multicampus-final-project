package com.dg.deukgeun.dto.user;

import com.dg.deukgeun.dto.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSignUpDTO {
    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private String detailAddress;
    private String password;
    private Integer approval;
    private UserRole role;
}

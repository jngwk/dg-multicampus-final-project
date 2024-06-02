package com.dg.deukgeun.dto.user;

import com.dg.deukgeun.Entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;
    private int exprTime;
    private UserEntity user;
}

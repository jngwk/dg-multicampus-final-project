package com.dg.deukgeun.dto.login;


import com.dg.deukgeun.Entity.UserEntity;
import com.dg.deukgeun.dto.UserRole;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class JoinRequestDTO {
    @NotBlank(message = "로그인 아이디가 비어있습니다.")
    private String email;

    @NotBlank(message = "비밀번호가 비어있습니다.")
    private String password;
    private String passwordCheck;

    // 비밀번호 암호화 X
    public UserEntity toEntity() {
        return UserEntity.builder()
                .email(this.email)
                .password(this.password)
                .role(UserRole.USER)
                .build();
    }

    // 비밀번호 암호화
    public UserEntity toEntity(String encodedPassword) {
        return UserEntity.builder()
                .email(this.email)
                .password(encodedPassword)
                .role(UserRole.USER)
                .build();
    }
}

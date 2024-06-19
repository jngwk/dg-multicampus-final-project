package com.dg.deukgeun.dto.user;

import com.dg.deukgeun.dto.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSignUpDTO {
    private Integer userId;

    @NotBlank(message = "사용자 이름은 필수 입력 항목입니다.")
    private String userName;

    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    @NotBlank(message = "주소는 필수 입력 항목입니다.")
    private String address;

    private String detailAddress;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    private String password;
    
    private UserRole role;
}

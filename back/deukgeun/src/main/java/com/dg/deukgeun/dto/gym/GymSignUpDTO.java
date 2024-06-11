/*
 * 체육관 계정으로 회원가입/로그인 시 사용
 */

package com.dg.deukgeun.dto.gym;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GymSignUpDTO {
    private Integer userId;

    @NotBlank(message = "사용자 이름은 필수 입력 항목입니다.")
    private String userName;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    private String password;

    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    @NotBlank(message = "주소는 필수 입력 항목입니다.")
    private String address;

    private String detailAddress;

    @NotBlank(message = "카테고리는 필수 입력 항목입니다.")
    private String category;

    @NotBlank(message = "헬스장 이름은 필수 입력 항목입니다.")
    private String gymName;

    @NotBlank(message = "사업자 번호는 필수 입력 항목입니다.")
    private String crNumber;

    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    private String phoneNumber;

    private Integer approval;
    
    private String operatingHours;
    private String prices;
    private String introduce;
}

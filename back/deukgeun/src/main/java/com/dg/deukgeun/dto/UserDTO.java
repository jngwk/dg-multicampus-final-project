package com.dg.deukgeun.dto;

import com.dg.deukgeun.Entity.UserEntity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserDTO {

    // private Long id;
    private int userId;

    @NotBlank(message = "이름은 필수 입력 항목입니다.")
    @Pattern(regexp = "^[a-zA-Z가-힣\\s]+$", message = "이름은 영문자, 한글만 사용할 수 있습니다.")
    private String userName;

    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    @NotBlank(message = "주소는 필수 입력 항목입니다.")
    private String address;

    @NotBlank(message = "카테고리는 필수 입력 항목입니다.")
    @Pattern(regexp = "^[a-zA-Z가-힣\\s]+$", message = "카테고리는 영문자, 한글만 사용할 수 있습니다.")
    private String category;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    // @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*])(?=\\S+$).{8,}$", 
    // message = "비밀번호는 최소 8자 이상, 대문자, 소문자, 숫자 및 특수 문자를 포함해야 합니다.")
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
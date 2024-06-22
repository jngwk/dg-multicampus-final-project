package com.dg.deukgeun.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDTO {
    private String userName;
    private Integer userId;
    private String email;
    private String address;
    private String detailAddress;
    private String password;

    private String trainerCareer;
    private String trainerAbout;
    private String trainerImage;
}
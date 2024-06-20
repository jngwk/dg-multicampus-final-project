package com.dg.deukgeun.dto.gym;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerDTO {
    private Integer trainerId;
    
    private String trainerCareer;
    private String trainerAbout;
    private String trainerImage;

    private Integer userId;
    private Integer gymId;

    private String userName;
    private String email;
    private String password;
    private String address;
    private String detailAddress;
}
package com.dg.deukgeun.dto.gym;
// written by Gachudon

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymResponseDTO {
    private Integer gymId;
    private String gymName;
    private Integer userId;
    private String crNumber;
    private String phoneNumber;
    private String address;
    private String detailAddress;
    private String operatingHours;
    private String prices;
    private String introduce;
    private Integer approval;
    @Builder.Default
    private List<String> uploadFileName = new ArrayList<>();
}

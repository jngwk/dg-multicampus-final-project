package com.dg.deukgeun.dto.gym;
// written by Gachudon

import java.util.ArrayList;
import java.util.List;

import com.dg.deukgeun.dto.TrainerDTO;

// import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymResponseDTO {
    // Gym 
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
    // private Integer approval;
    @Builder.Default
    private List<String> uploadFileName = new ArrayList<>();

    //트레이너 정보 List
    @Builder.Default
    private List<TrainerDTO> trainersList = new ArrayList<>();
}

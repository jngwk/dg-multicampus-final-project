package com.dg.deukgeun.dto.gym;
// written by Gachudon

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.dto.ProductDTO;

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
    private String userName;
    private Integer userId;
    private String crNumber;
    private String phoneNumber;
    private String address;
    private String detailAddress;
    private String operatingHours;
    private String introduce;
    private String SNSLink;
    // private Integer approval;
    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>();
    @Builder.Default
    private List<String> uploadFileName = new ArrayList<>();

    // 트레이너 정보 List
    @Builder.Default
    private List<TrainerDTO> trainersList = new ArrayList<>();

    // 상품명
    @Builder.Default
    private List<ProductDTO> productList = new ArrayList<>();
}

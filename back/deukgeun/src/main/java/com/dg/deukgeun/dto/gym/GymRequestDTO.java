package com.dg.deukgeun.dto.gym;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.dto.ProductDTO;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymRequestDTO {
    private Integer userId;
    private String userName;
    private String gymName;
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
    @Builder.Default
    private List<ProductDTO> productList = new ArrayList<>();
}

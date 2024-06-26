package com.dg.deukgeun.dto.review;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ReviewRequestDTO {

    private Integer id;
    private Integer gymId; // Gym의 id만을 저장할 필드
    private Integer userId; // User의 id만을 저장할 필드
    private Integer rating;
    private String comment;
    private String userName;
    private String email;

    private LocalDateTime createdAt;
    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>();
    @Builder.Default
    private List<String> uploadFileName = new ArrayList<>();

}
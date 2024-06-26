package com.dg.deukgeun.dto.review;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.entity.Review;
import com.dg.deukgeun.entity.ReviewImage;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewResponseDTO {

    private Integer id;
    private Integer gymId; // Gym의 id만을 저장할 필드
    private Integer userId; // User의 id만을 저장할 필드
    private Integer rating;
    private String comment;
    private String userName;
    private String email;
    private List<String> images;
    private LocalDateTime createdAt;
    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>();
    @Builder.Default
    private List<String> uploadFileName = new ArrayList<>();
}
package com.dg.deukgeun.dto;

import org.springframework.web.multipart.MultipartFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsersDTO {
    private Integer userId;
    private String userName;
    private String password;
    private String email;
    private String address;
    private String detailAddress;
    private UserRole role;

    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>(); // 서버에 저장되는 실제 파일 데이터
    private String uploadFileName; // 데이터베이스에 저장될 파일 이름 (단일 파일 이름)e
}
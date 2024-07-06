package com.dg.deukgeun.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {
    // private final String uploadPath = System.getenv("UPLOAD_PATH");
    private final String uploadPath = "C:\\Users\\deukgeun2\\deploy\\git\\dg-multicampus-final-project\\front\\deukgeun\\public\\images";
    // @Value("${upload.path}")
    // private String uploadPath;
    @PostConstruct
    public void init() {
        File tempFolder = new File(uploadPath);
        if (tempFolder.exists() == false) {
            tempFolder.mkdir();
        }
        log.info("--------------------");
        log.info(uploadPath);
    }

    public List<String> saveFile(List<MultipartFile> files) throws RuntimeException {
        if (files == null || files.size() == 0) {
            return List.of();
        }
        List<String> uploadNames = new ArrayList<>();
        for (MultipartFile multipartFile : files) {
            String savedName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
            Path savedPath = Paths.get(uploadPath, savedName);
            try {
                log.info("before copy");
                Files.copy(multipartFile.getInputStream(), savedPath);
                log.info("after copy");
                uploadNames.add(savedName);
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage());
            }
        }
        return uploadNames;
    }

    // 파일 데이터를 읽어서 Resource 타입으로 반환
    public ResponseEntity<Resource> getUserImage(String userId) {
        try {
            String fileName = getUserImageName(userId);
            Path imagePath = Paths.get(uploadPath, fileName);

            if (Files.exists(imagePath)) {
                ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(imagePath));
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
                headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(imagePath));
                return ResponseEntity.ok()
                        .headers(headers)
                        .contentLength(Files.size(imagePath))
                        .contentType(MediaType.parseMediaType(Files.probeContentType(imagePath)))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 사용자 프로필 이미지 파일명 조회 메서드
    public String getUserImageName(String userId) {
        return userId + "_profile.jpg"; // 예시로 파일명을 userId_profile.jpg로 가정
    }

    public void deleteFiles(List<String> fileNames) {
        if (fileNames == null || fileNames.size() == 0) {
            return;
        }
        fileNames.forEach(fileName -> {
            Path filePath = Paths.get(uploadPath, fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage());
            }
        });
    }

    public String updateFile(MultipartFile file, String existingFileName) throws RuntimeException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is null or empty.");
        }

        // Delete existing file
        deleteFile(existingFileName);

        // Save new file
        List<MultipartFile> newFiles = new ArrayList<>();
        newFiles.add(file);
        List<String> newFileNames = saveFile(newFiles);
        if (!newFileNames.isEmpty()) {
            return newFileNames.get(0); // Return the saved file name
        } else {
            throw new RuntimeException("Failed to update file.");
        }
    }

    // Delete a single file from the upload directory
    public void deleteFile(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("File name is null or empty.");
        }
        Path filePath = Paths.get(uploadPath, fileName);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }
}

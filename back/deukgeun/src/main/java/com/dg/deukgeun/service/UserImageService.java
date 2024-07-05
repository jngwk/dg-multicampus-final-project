package com.dg.deukgeun.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.dto.user.UserImageDTO;
import com.dg.deukgeun.entity.UserImage;
import com.dg.deukgeun.repository.UserImageRepository;
import com.dg.deukgeun.util.CustomFileUtil;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@Transactional
@RequiredArgsConstructor
public class UserImageService {
    private final ModelMapper modelMapper;
    private final UserImageRepository userImageRepository;
    private final CustomFileUtil customFileUtil;

    // 이미지 삽입
    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN') && #userId == principal.userId")
    @Transactional
    public void insert(MultipartFile file, Integer userId) {
        try {
            String savedFileName = customFileUtil.saveFile(List.of(file)).get(0);
            UserImage userImage = userImageRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElse(new UserImage());
            userImage.setUserId(userId);
            userImage.setUserImage(savedFileName);
            userImageRepository.save(userImage);
            log.info("User image inserted/updated successfully for user ID: {}", userId);
        } catch (Exception e) {
            log.error("Error inserting/updating user image for user ID: {}", userId, e);
            throw new RuntimeException("Failed to insert/update user image for user ID: " + userId);
        }
    }

    // 이미지 조회
    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN') && #userId == principal.userId")
    public UserImageDTO getByUserId(Integer userId) {
        Optional<UserImage> result = userImageRepository.findByUserId(userId).stream().findFirst();
        return result.map(userImage -> modelMapper.map(userImage, UserImageDTO.class)).orElse(null);
    }

    // 이미지 업데이트
    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN') && #userId == principal.userId")
    public void update(MultipartFile newFile, Integer userId) {
        try {
            Optional<UserImage> optionalUserImage = userImageRepository.findByUserId(userId).stream().findFirst();
            if (optionalUserImage.isPresent()) {
                UserImage userImage = optionalUserImage.get();
                String oldFileName = userImage.getUserImage();

                // 이전 파일 삭제
                customFileUtil.deleteFile(oldFileName);

                // 새 파일 저장 및 엔터티 업데이트
                String savedFileName = customFileUtil.saveFile(List.of(newFile)).get(0);
                userImage.setUserImage(savedFileName);
                userImageRepository.save(userImage);

                log.info("User image updated successfully for user ID: {}", userId);
            } else {
                log.error("User image not found for user ID: {}", userId);
                throw new EntityNotFoundException("User image not found for user ID: " + userId);
            }
        } catch (Exception e) {
            log.error("Error updating user image for user ID: {}", userId, e);
            throw e;
        }
    }

    // 이미지 삭제
    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN') && #userId == principal.userId")
    public void delete(Integer userId) {
        Optional<UserImage> optionalUserImage = userImageRepository.findByUserId(userId).stream().findFirst();
        if (optionalUserImage.isPresent()) {
            UserImage userImage = optionalUserImage.get();
            String fileName = userImage.getUserImage();

            try {
                // 파일 시스템에서 파일 삭제
                customFileUtil.deleteFile(fileName);
            } catch (Exception e) {
                log.error("Failed to delete file {} from file system", fileName, e);
            }

            // 데이터베이스에서 엔터티 삭제
            userImageRepository.delete(userImage);

            log.info("User image deleted successfully for user ID: {}", userId);
        } else {
            log.error("User image not found for user ID: {}", userId);
            throw new EntityNotFoundException("User image not found for user ID: " + userId);
        }
    }
}

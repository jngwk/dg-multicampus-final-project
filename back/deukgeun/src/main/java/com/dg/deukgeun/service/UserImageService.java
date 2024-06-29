package com.dg.deukgeun.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private UserImageRepository userImageRepository;
    @Autowired
    private CustomFileUtil customFileUtil;

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN') && #userId == principal.userId")
    public void insert(MultipartFile file, Integer userId) {
        String savedFileName = customFileUtil.saveFile(List.of(file)).get(0);

        UserImage userImage = UserImage.builder()
                                        .userImage(savedFileName)
                                        .userId(userId)
                                        .build();
        userImageRepository.save(userImage);
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN') && #userId == principal.userId")
    public UserImageDTO getByUserId(Integer userId) {
        Optional<UserImage> result = userImageRepository.findByUserId(userId).stream().findFirst();
        return result.map(userImage -> modelMapper.map(userImage, UserImageDTO.class)).orElse(null);
    }

   @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN') && #userId == principal.userId")
    public void update(MultipartFile newFile, Integer userId) {
        try {
            Optional<UserImage> optionalUserImage = userImageRepository.findByUserId(userId).stream().findFirst();
            if (optionalUserImage.isPresent()) {
                UserImage userImage = optionalUserImage.get();
                String oldFileName = userImage.getUserImage();

                customFileUtil.deleteFiles(List.of(oldFileName));
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
}

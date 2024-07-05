package com.dg.deukgeun.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.dto.review.ReviewImageDTO;
import com.dg.deukgeun.entity.ReviewImage;
import com.dg.deukgeun.repository.ReviewImageRepository;
import com.dg.deukgeun.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ReviewImageService {

    private final ModelMapper modelMapper;
    private final ReviewImageRepository reviewImageRepository;
    private final CustomFileUtil fileUtil; //  CustomFileUtil 추가

    public void insertList(List<ReviewImageDTO> dtoList) {
        List<ReviewImage> reviewImageList = dtoList.stream()
                .map(dto -> modelMapper.map(dto, ReviewImage.class))
                .collect(Collectors.toList());
        reviewImageRepository.saveAll(reviewImageList);
    }

    public List<ReviewImageDTO> getByReviewId(Integer reviewId) {
        List<ReviewImage> result = reviewImageRepository.findByReviewId(reviewId);
        return result.stream()
                .map(reviewImage -> modelMapper.map(reviewImage, ReviewImageDTO.class))
                .collect(Collectors.toList());
    }

    public void remove(String reviewImage) {
        reviewImageRepository.deleteById(reviewImage);
    }

 public void deleteImages(Integer reviewId) {
        List<ReviewImage> reviewImages = reviewImageRepository.findByReviewId(reviewId);

        List<String> imageFileNames = reviewImages.stream()
                .map(ReviewImage::getReviewImage)
                .collect(Collectors.toList());

        fileUtil.deleteFiles(imageFileNames);

        reviewImageRepository.deleteByReviewId(reviewId);
    }

    // 다수 이미지 업데이트
    public void updateImages(Integer reviewId, List<MultipartFile> newFiles, List<String> imageNames) {
        try {
            // Delete old images if imageNames is provided
            if (imageNames != null && !imageNames.isEmpty()) {
                System.out.println(imageNames);
                fileUtil.deleteFiles(imageNames);
                reviewImageRepository.deleteAllById(imageNames);
            }
    
            // Save new images if newFiles is provided
            if (newFiles != null && !newFiles.isEmpty()) {
                List<String> savedFileNames = fileUtil.saveFile(newFiles);
                List<ReviewImage> reviewImages = savedFileNames.stream()
                        .map(fileName -> new ReviewImage(fileName, reviewId))
                        .collect(Collectors.toList());
                reviewImageRepository.saveAll(reviewImages);
            }
            
        } catch (Exception e) {
            log.error("Error updating review images for review ID: {}", reviewId, e);
            throw new RuntimeException("Failed to update review images for review ID: " + reviewId);
        }
    }
}

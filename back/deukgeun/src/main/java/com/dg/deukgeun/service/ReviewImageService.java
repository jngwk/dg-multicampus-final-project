package com.dg.deukgeun.service;

import com.dg.deukgeun.dto.review.ReviewImageDTO;
import com.dg.deukgeun.entity.ReviewImage;
import com.dg.deukgeun.repository.ReviewImageRepository;
import com.dg.deukgeun.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
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
        // Retrieve images by reviewId
        List<ReviewImage> reviewImages = reviewImageRepository.findByReviewId(reviewId);

        // Extract image filenames from entities
        List<String> imageFileNames = reviewImages.stream()
                .map(ReviewImage::getReviewImage)
                .collect(Collectors.toList());

        // Delete files from file system
        fileUtil.deleteFiles(imageFileNames);

        // Delete database records
        reviewImageRepository.deleteByReviewId(reviewId);
    }

    public void updateImages(Integer reviewId, List<MultipartFile> updatedImages) {
        // Delete existing images for the review
        deleteImages(reviewId);

        // Save updated images to file system and database
        List<String> savedImageNames = fileUtil.saveFile(updatedImages);
        List<ReviewImageDTO> updatedImageDTOs = savedImageNames.stream()
                .map(fileName -> ReviewImageDTO.builder().reviewId(reviewId).reviewImage(fileName).build())
                .collect(Collectors.toList());

        List<ReviewImage> reviewImageList = updatedImageDTOs.stream()
                .map(dto -> modelMapper.map(dto, ReviewImage.class))
                .collect(Collectors.toList());

        reviewImageRepository.saveAll(reviewImageList);
    }
}

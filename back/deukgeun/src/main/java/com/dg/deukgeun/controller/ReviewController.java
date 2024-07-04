package com.dg.deukgeun.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.dto.review.ReviewDTO;
import com.dg.deukgeun.dto.review.ReviewImageDTO;
import com.dg.deukgeun.dto.review.ReviewRequestDTO;
import com.dg.deukgeun.dto.review.ReviewResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.ReviewImageService;
import com.dg.deukgeun.service.ReviewService;
import com.dg.deukgeun.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final CustomFileUtil fileUtil;
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ReviewImageService reviewImageService;

    @PreAuthorize("hasRole('ROLE_GENERAL')")
    @PostMapping("/registerReview")
    public Map<String, String> registerReview(@RequestBody ReviewRequestDTO reviewRequestDTO) {
        log.info("Received ReviewRequestDTO: {}", reviewRequestDTO);
        try {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setUserId(reviewRequestDTO.getUserId());
            reviewDTO.setGymId(reviewRequestDTO.getGymId());
            reviewDTO.setId(reviewRequestDTO.getId());
            reviewDTO.setRating(reviewRequestDTO.getRating());
            reviewDTO.setComment(reviewRequestDTO.getComment());
            reviewDTO.setUserName(reviewRequestDTO.getUserName());
            reviewDTO.setEmail(reviewRequestDTO.getEmail());

            Integer reviewId = reviewService.registerReview(reviewDTO);
            log.info("Review registered with ID: {}", reviewId);

            return Map.of("RESULT", "SUCCESS", "reviewId", reviewId.toString());
        } catch (Exception e) {
            log.error("Error registering review", e);
            return Map.of("RESULT", "FAILURE");
        }
    }

    @PreAuthorize("hasRole('ROLE_GENERAL')")
    @PutMapping("/update/{reviewId}")
    public ResponseDTO<?> updateReview(@PathVariable Integer reviewId, @RequestBody ReviewDTO reviewDTO) {
        log.info("reviewDTO: " + reviewDTO);
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Integer userId = userDetails.getUserId();
        
        // Ensure reviewId is provided and matches the path variable
            if (!reviewId.equals(reviewDTO.getId())) {
                return ResponseDTO.setFailed("Mismatch between path variable and review ID in payload.");
            }
        
            reviewImageService.getByReviewId(reviewId);
            reviewService.updateReview(reviewDTO, userId);
            return ResponseDTO.setSuccess("Review updated successfully.");
        } catch (Exception e) {
            return ResponseDTO.setFailed("Failed to update review.");
        }
    }

    @PreAuthorize("hasRole('ROLE_GENERAL')")
    @PostMapping("/uploadImages/{reviewId}")
    public Map<String, String> uploadImages(@PathVariable Integer reviewId, @RequestPart("files") List<MultipartFile> files) {
        log.info("Received files for review ID: {}", reviewId);
        try {
            List<String> uploadFileNames = fileUtil.saveFile(files);
            log.info("Uploaded file names: {}", uploadFileNames);

            List<ReviewImageDTO> reviewImageDTOList = new ArrayList<>();
            for (String fileName : uploadFileNames) {
                reviewImageDTOList.add(new ReviewImageDTO(fileName, reviewId));
            }

            reviewImageService.insertList(reviewImageDTOList);
            log.info("Images inserted for review ID: {}", reviewId);
            return Map.of("RESULT", "SUCCESS");
        } catch (Exception e) {
            log.error("Error uploading images for review ID: {}", reviewId, e);
            return Map.of("RESULT", "FAILURE");
        }
    }
    @PreAuthorize("hasRole('ROLE_GENERAL')")
    @DeleteMapping("/deleteImages/{reviewId}")
    public Map<String, String> deleteImages(@PathVariable Integer reviewId) {
        log.info("Deleting images for review ID: {}", reviewId);
        try {
            reviewImageService.deleteImages(reviewId);
            return Map.of("RESULT", "SUCCESS");
        } catch (Exception e) {
            log.error("Error deleting images for review ID: {}", reviewId, e);
            return Map.of("RESULT", "FAILURE");
        }
    }

    @PreAuthorize("hasRole('ROLE_GENERAL')")
    @PutMapping("/updateImages/{reviewId}")
    public Map<String, String> updateImages(@PathVariable Integer reviewId, @RequestBody List<MultipartFile> updatedImages) {
        log.info("Updating images for review ID: {}", reviewId);
        try {
            reviewImageService.updateImages(reviewId, updatedImages);
            return Map.of("RESULT", "SUCCESS");
        } catch (Exception e) {
            log.error("Error updating images for review ID: {}", reviewId, e);
            return Map.of("RESULT", "FAILURE");
        }
    }
    
    // @GetMapping("/reviewList/{gymId}")
    // public List<ReviewDTO> getReviewsByGymId(@PathVariable Integer gymId) {
    //     return reviewService.getReviewsByGymId(gymId);
    // }
    @GetMapping("/reviewList/{gymId}")
    public List<ReviewResponseDTO> getReviewsByGymId(@PathVariable Integer gymId) {
        try {
            List<ReviewResponseDTO> reviews = reviewService.getReviewsByGymId(gymId);
            log.info("Fetched reviews for gym ID: " + gymId);
            return reviews;
        } catch (Exception e) {
            log.error("Error fetching reviews for gym ID: " + gymId, e);
            throw e;
        }
    }

    @DeleteMapping("/delete/{reviewId}")
    public ResponseDTO<?> deleteReview(@PathVariable Integer reviewId) {
         try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Integer userId = userDetails.getUserId();
            reviewService.deleteReview(reviewId, userId);
            return ResponseDTO.setSuccess("Review deleted successfully.");
        } catch (Exception e) {
            return ResponseDTO.setFailed("Review deleted successfully.");
        }
    }


    @PostMapping("/insertImage/{reviewId}")
    public Map<String, String> insertImage(@PathVariable(name = "reviewId") Integer reviewId, @RequestBody ReviewRequestDTO reviewRequestDTO) {
        List<ReviewImageDTO> dtoList = new ArrayList<>();
        List<MultipartFile> files = reviewRequestDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFile(files);
        for (int i = 0; i < files.size(); i++) {
            ReviewImageDTO dto = new ReviewImageDTO();
            dto.setReviewId(reviewId);
            dto.setReviewImage(uploadFileNames.get(i));
            dtoList.add(dto);
        }
        reviewImageService.insertList(dtoList);
        return Map.of("RESULT", "SUCESS");
    }

    // 헬스장 이미지 삭제
    @DeleteMapping("/deleteImage/{reviewImage}")
    public Map<String, String> removeImage(@PathVariable(name = "reviewImage") String reviewImage) {
        reviewImageService.remove(reviewImage);
        return Map.of("RESULT", "SUCCESS");
    }
}
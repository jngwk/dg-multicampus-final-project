package com.dg.deukgeun.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.review.ReviewDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public ResponseDTO<?> addReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Integer userId = userDetails.getUserId();
            reviewService.saveReview(reviewDTO, userId);
            return ResponseDTO.setSuccess("Review added successfully.");
        } catch (Exception e) {
            return ResponseDTO.setFailed("Failed to add review.");
        }
    }

    @GetMapping("/reviewList/{gymId}")
    public List<ReviewDTO> getReviewsByGymId(@PathVariable Integer gymId) {
        return reviewService.getReviewsByGymId(gymId);
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

    @PutMapping("/update/{reviewId}")
    public ResponseDTO<?> updateReview(@PathVariable Integer reviewId, @RequestBody ReviewDTO reviewDTO) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Integer userId = userDetails.getUserId();
        
        // Ensure reviewId is provided and matches the path variable
            if (!reviewId.equals(reviewDTO.getId())) {
                return ResponseDTO.setFailed("Mismatch between path variable and review ID in payload.");
            }
        
            reviewService.updateReview(reviewDTO, userId);
            return ResponseDTO.setSuccess("Review updated successfully.");
        } catch (Exception e) {
            return ResponseDTO.setFailed("Failed to update review.");
        }
    }
}
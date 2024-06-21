package com.dg.deukgeun.service;

import com.dg.deukgeun.dto.review.ReviewDTO;
import com.dg.deukgeun.entity.Review;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.repository.ReviewRepository;
import com.dg.deukgeun.repository.UserRepository;

import jakarta.transaction.Transactional;

import com.dg.deukgeun.repository.GymRepository;

import lombok.extern.log4j.Log4j2;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Log4j2
@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GymRepository gymRepository;

    @PreAuthorize("hasRole('ROLE_GENERAL')")
    public Review saveReview(ReviewDTO reviewDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));
        Gym gym = gymRepository.findById(reviewDTO.getGymId()).orElseThrow(() -> new RuntimeException("Gym not found"));
        Review review = new Review();
        log.info(user.getUserId());
        review.setGymId(gym.getGymId());
        review.setUserId(user.getUserId());
        review.setUserName(user.getUserName());
        review.setEmail(user.getEmail());
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }
    public List<ReviewDTO> getReviewsByGymId(Integer gymId) {
        return reviewRepository.findByGymId(gymId).stream()
                .map(review -> new ReviewDTO(review))
                .collect(Collectors.toList());
    }
    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_ADMIN')")
    public void deleteReview(Integer reviewId, Integer userId) {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isPresent()) {
            Review review = reviewOptional.get();
            
            // 현재 로그인한 사용자의 ID와 리뷰의 작성자 ID를 비교하여 일치할 경우에만 삭제 수행
            if (review.getUserId().equals(userId)) {
                reviewRepository.deleteById(reviewId);
            }
        }
    }

    @PreAuthorize("hasRole('ROLE_GENERAL')")
    @Transactional
    public void updateReview(ReviewDTO reviewDTO, Integer userId) {
        Optional<Review> optionalReview = reviewRepository.findById(reviewDTO.getId());
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            if (review.getUserId().equals(userId)) {
                System.out.println("Original Review: " + review);
                review.setRating(reviewDTO.getRating());
                review.setComment(reviewDTO.getComment());
                review.setCreatedAt(LocalDateTime.now());
                System.out.println("Updated Review: " + review);
                reviewRepository.save(review);
                System.out.println("Review saved successfully.");
            } else {
                System.out.println("User is not authorized to update this review.");
            }
        } else {
            System.out.println("Review not found");
        }
    }
    
}
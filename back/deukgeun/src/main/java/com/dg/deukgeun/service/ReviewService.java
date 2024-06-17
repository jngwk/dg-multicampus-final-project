package com.dg.deukgeun.service;

import com.dg.deukgeun.dto.review.ReviewDTO;
import com.dg.deukgeun.entity.Review;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.ReviewRepository;
import com.dg.deukgeun.repository.UserRepository;

import lombok.Data;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

   
    @PreAuthorize("hasRole('ROLE_GENERAL')")
    public Review saveReview(ReviewDTO reviewDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setGymId(reviewDTO.getGymId());
        review.setUserId(user.getUserId());
        review.setUserName(user.getUserName());
        review.setUserEmail(user.getEmail());
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        return reviewRepository.save(review);
    }
    public List<ReviewDTO> getReviewsByGymId(Integer gymId) {
        return reviewRepository.findByGymId(gymId).stream()
                .map(review -> new ReviewDTO(review))
                .collect(Collectors.toList());
    }

    public void deleteReview(Integer reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    public void updateReview(ReviewDTO reviewDTO) {
        Optional<Review> optionalReview = reviewRepository.findById(reviewDTO.getId());
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            // update review entity from reviewDTO
            reviewRepository.save(review);
        } else {
            throw new RuntimeException("Review not found");
        }
    }
    
}
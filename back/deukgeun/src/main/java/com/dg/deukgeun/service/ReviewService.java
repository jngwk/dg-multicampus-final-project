package com.dg.deukgeun.service;

import com.dg.deukgeun.dto.review.ReviewDTO;
import com.dg.deukgeun.entity.Review;
import com.dg.deukgeun.repository.ReviewRepository;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review saveReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setGym(reviewDTO.getGym());
        review.setUser(reviewDTO.getUser());
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

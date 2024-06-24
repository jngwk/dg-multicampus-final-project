package com.dg.deukgeun.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.review.ReviewDTO;
import com.dg.deukgeun.entity.Review;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.ReviewRepository;
import com.dg.deukgeun.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepository userRepository;
    
    @PreAuthorize("hasRole('ROLE_GENERAL')")
    public Integer registerReview(ReviewDTO reviewDTO) {
        log.info("Registering ReviewDTO...");
    
        Review review = modelMapper.map(reviewDTO, Review.class);
        log.info("Mapped Review: {}", review);

        if (reviewDTO.getUserId() != null) {
            log.info("UserId from ReviewDTO: {}", reviewDTO.getUserId());
        
            Optional<User> userResult = userRepository.findByUserId(reviewDTO.getUserId());
            if (userResult.isPresent()) {
                User user = userResult.get();
                log.info("User found: {}", user);

                review.setUserId(user.getUserId());
                review.setUserName(user.getUserName());
                review.setEmail(user.getEmail());
             
                review.setGymId(reviewDTO.getGymId());
                review.setRating(reviewDTO.getRating());
                review.setComment(reviewDTO.getComment());
            } else {
                log.warn("User with userId {} not found", reviewDTO.getUserId());
            }
        
            if (review.getCreatedAt() == null) {
                review.setCreatedAt(LocalDateTime.now());
            }
        } else {
            log.warn("UserId in ReviewDTO is null");
        }

        Review saveReview = reviewRepository.save(review);
        log.info("Review saved: {}", saveReview);

        return saveReview.getId();
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

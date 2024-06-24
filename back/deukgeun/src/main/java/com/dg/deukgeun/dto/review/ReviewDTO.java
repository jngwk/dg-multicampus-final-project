package com.dg.deukgeun.dto.review;

import java.time.LocalDateTime;

import com.dg.deukgeun.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private Integer id;
    private Integer gymId; // Gym의 id만을 저장할 필드
    private Integer userId; // User의 id만을 저장할 필드
    private Integer rating;
    private String comment;
    private String userName;
    private String email;

    private LocalDateTime createdAt;

    // Constructors, Getters, and Setters

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.gymId = review.getGymId(); // Gym의 id 가져오기
        this.userId = review.getUserId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
        this.userName = review.getUserName();
        this.email = review.getEmail();
    }

    // other constructors, getters and setters
}
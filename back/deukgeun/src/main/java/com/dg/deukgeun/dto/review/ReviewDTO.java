package com.dg.deukgeun.dto.review;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.Review;
import com.dg.deukgeun.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private int id;
    private int gymId;
    private int userId;
    private int rating;
    private String comment;
    private String userName;
    private String userEmail;

    private LocalDateTime createdAt;

    // Constructors, Getters, and Setters

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.gymId = review.getGymId();
        this.userId = review.getUserId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
        this.userName = review.getUserName();
        this.userEmail = review.getUserEmail();
    }

    // other constructors, getters and setters
}
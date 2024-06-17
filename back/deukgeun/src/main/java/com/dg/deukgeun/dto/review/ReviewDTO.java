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
    private Gym gym;
    private User user;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    // Constructors, Getters, and Setters

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.gym = review.getGym();
        this.user = review.getUser();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
    }

    // other constructors, getters and setters
}

package com.dg.deukgeun.entity;
// written by Gachudon

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "review_image")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ReviewImage {
    @Id
    private String reviewImage;
    private Integer reviewId;
}

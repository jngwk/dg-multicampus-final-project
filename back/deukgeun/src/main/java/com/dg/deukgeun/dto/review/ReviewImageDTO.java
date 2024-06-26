package com.dg.deukgeun.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewImageDTO {
    private String reviewImage;
    private Integer reviewId;
}

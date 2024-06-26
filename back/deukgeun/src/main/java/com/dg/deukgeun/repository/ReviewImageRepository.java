package com.dg.deukgeun.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.ReviewImage;

public interface ReviewImageRepository extends JpaRepository<ReviewImage,String>{
    public List<ReviewImage> findByReviewId(Integer reviewId);
}
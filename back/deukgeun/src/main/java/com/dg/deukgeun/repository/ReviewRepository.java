package com.dg.deukgeun.repository;

import com.dg.deukgeun.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByGymId(Integer gymId);
    List<Review> findByUserId(Integer userId);
}
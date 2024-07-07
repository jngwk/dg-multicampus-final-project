package com.dg.deukgeun.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dg.deukgeun.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByGymId(Integer gymId);

    List<Review> findByUserId(Integer userId);

    @Query("SELECT AVG(6 - r.rating) FROM Review r WHERE r.gymId = :gymId")
    Optional<Double> getAverageRating(@Param("gymId") Integer gymId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.gymId = :gymId")
    Long countReviewsByGymId(@Param("gymId") Integer gymId);
}
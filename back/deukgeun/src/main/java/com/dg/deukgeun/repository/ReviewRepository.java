package com.dg.deukgeun.repository;

import com.dg.deukgeun.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByGymId(Integer gymId);
<<<<<<< HEAD
    List<Review> findByUserId(Integer userId);
}
=======
}
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

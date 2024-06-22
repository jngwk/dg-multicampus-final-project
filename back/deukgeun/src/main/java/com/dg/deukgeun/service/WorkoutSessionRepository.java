package com.dg.deukgeun.service;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.WorkoutSession;
<<<<<<< HEAD:back/deukgeun/src/main/java/com/dg/deukgeun/repository/WorkoutSessionRepository.java
import java.time.LocalDate;

=======
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12:back/deukgeun/src/main/java/com/dg/deukgeun/service/WorkoutSessionRepository.java

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession,Integer>{
    public List<WorkoutSession> findByUserIdAndWorkoutDateBetween(Integer userId,LocalDate startDate, LocalDate endDate);
}

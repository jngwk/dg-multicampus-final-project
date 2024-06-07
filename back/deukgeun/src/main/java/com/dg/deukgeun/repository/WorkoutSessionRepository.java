package com.dg.deukgeun.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.WorkoutSession;
import java.time.LocalDate;


public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession,Integer>{
    List<WorkoutSession> findByUserIdAndWorkoutDateBetween(Integer userId,LocalDate startDate, LocalDate endDate);
}

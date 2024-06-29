package com.dg.deukgeun.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.WorkoutSession;
import java.time.LocalDate;


public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession,Integer>{
    public List<WorkoutSession> findByUserIdAndWorkoutDateBetween(Integer userId,LocalDate startDate, LocalDate endDate);
    public Optional<WorkoutSession> findByPtSessionId(Integer ptSessionId);
    public void deleteByPtSessionId(Integer ptSessionId);
}

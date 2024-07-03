package com.dg.deukgeun.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.WorkoutSession;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Integer> {
    public List<WorkoutSession> findByUser_UserIdAndWorkoutDateBetween(Integer userId, LocalDate startDate,
            LocalDate endDate);

    public Optional<WorkoutSession> findByPtSession_PtSessionId(Integer ptSessionId);

    public void deleteByPtSession_PtSessionId(Integer ptSessionId);

    Optional<List<WorkoutSession>> findByPtSession_TrainerAndWorkoutDateBetween(Trainer trainer, LocalDate startDate, LocalDate endDate);
    
    List<WorkoutSession> findByUser_UserIdInAndPtSessionIsNotNull(List<Integer> userIds);
}

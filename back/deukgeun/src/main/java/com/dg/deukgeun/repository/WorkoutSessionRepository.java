package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.domain.WorkoutSession;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession,Integer>{
    
}

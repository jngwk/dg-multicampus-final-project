package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.WorkoutSession;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession,Integer>{
    
}

package com.dg.deukgeun.service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.Entity.WorkoutSession;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession,Integer>{
    
}

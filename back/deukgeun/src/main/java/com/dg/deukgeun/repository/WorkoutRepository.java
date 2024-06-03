package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Workout;
import java.util.List;


public interface WorkoutRepository extends JpaRepository<Workout,Integer> {
    List<Workout> findByWorkoutSessionId(Integer workoutSessionId);
}

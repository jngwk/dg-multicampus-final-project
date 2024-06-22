package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Workout;
<<<<<<< HEAD
import java.util.List;

=======
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

public interface WorkoutRepository extends JpaRepository<Workout,Integer> {
    public List<Workout> findByWorkoutSessionId(Integer workoutSessionId);
    public void deleteByWorkoutSessionId(Integer workoutSessionId);
}


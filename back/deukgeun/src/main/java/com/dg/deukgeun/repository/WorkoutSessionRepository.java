package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

<<<<<<< HEAD
import com.dg.deukgeun.Entity.WorkoutSession;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
}

=======
import com.dg.deukgeun.domain.WorkoutSession;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession,Integer>{
    
}
>>>>>>> origin/main

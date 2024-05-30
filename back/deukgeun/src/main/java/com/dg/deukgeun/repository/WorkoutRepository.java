package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

<<<<<<< HEAD
import com.dg.deukgeun.Entity.Workout;

public interface WorkoutRepository extends JpaRepository<Workout, Long>{

}
=======
import com.dg.deukgeun.domain.Workout;

public interface WorkoutRepository extends JpaRepository<Workout,Integer> {

}
>>>>>>> origin/main

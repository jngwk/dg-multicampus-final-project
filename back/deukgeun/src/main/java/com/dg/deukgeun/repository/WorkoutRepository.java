package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.domain.Workout;

public interface WorkoutRepository extends JpaRepository<Workout,Integer> {

}

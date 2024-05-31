package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Workout;

public interface WorkoutRepository extends JpaRepository<Workout,Integer> {

}

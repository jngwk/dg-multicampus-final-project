package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Gym;

public interface GymRepository extends JpaRepository<Gym, Integer> {
    
}
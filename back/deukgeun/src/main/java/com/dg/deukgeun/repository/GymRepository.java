package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dg.deukgeun.Entity.Gym;

public interface GymRepository extends JpaRepository<Gym, Integer> {
    
}
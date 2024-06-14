package com.dg.deukgeun.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;


public interface GymRepository extends JpaRepository<Gym, Integer> {
    Optional<Gym> findByUser(User user); 
}
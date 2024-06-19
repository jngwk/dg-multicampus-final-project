package com.dg.deukgeun.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Trainer;

// @Repository
public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> findByUser_UserId(int userId);
    // @Query(value="select t from Trainer t where Trainer.gym.gym = ?1")
    List<Trainer> findAllBygymGymId(Integer gymId);
}
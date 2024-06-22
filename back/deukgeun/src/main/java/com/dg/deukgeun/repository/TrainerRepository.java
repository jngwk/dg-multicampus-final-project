package com.dg.deukgeun.repository;

<<<<<<< HEAD
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Trainer;

// @Repository
public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> findByUser_UserId(int userId);
    // @Query(value="select t from Trainer t where Trainer.gym.gym = ?1")
    List<Trainer> findAllBygymGymId(Integer gymId);
=======
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dg.deukgeun.entity.Trainer;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> findByUser_UserId(int userId);
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
}
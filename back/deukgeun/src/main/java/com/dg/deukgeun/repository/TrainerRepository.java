package com.dg.deukgeun.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dg.deukgeun.entity.Trainer;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> findByUser_UserId(int userId);
    List<Trainer> findAllTrainerBy_gymId(Integer gymId);
}
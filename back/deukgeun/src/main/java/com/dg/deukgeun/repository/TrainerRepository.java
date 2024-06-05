package com.dg.deukgeun.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dg.deukgeun.entity.Trainer;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> findByUser_UserId(int userId);
}
package com.dg.deukgeun.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.PtSession;

public interface PtSessionRepository extends JpaRepository<PtSession, Integer> {
    public List<PtSession> findByTrainer_TrainerId(Integer trainerId);
}

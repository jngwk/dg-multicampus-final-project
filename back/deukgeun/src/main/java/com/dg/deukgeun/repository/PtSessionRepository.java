package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.PtSession;

public interface PtSessionRepository extends JpaRepository<PtSession, Long> {
}
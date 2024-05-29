package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.Entity.Chart;

public interface ChartDataRepository extends JpaRepository<Chart, Long> {
}

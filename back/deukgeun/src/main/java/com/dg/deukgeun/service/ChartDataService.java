package com.dg.deukgeun.service;

import com.dg.deukgeun.entity.Chart;
import com.dg.deukgeun.repository.ChartDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChartDataService {
    @Autowired
    private ChartDataRepository chartDataRepository;

    public List<Chart> getAllChartData() {
        return chartDataRepository.findAll();
    }
}

package com.dg.deukgeun.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dg.deukgeun.Entity.Chart;
import com.dg.deukgeun.repository.ChartDataRepository;

@RestController
@RequestMapping("/api")
public class ChartController {

    @Autowired
    private ChartDataRepository chartDataRepository;

    @GetMapping("/chart")
    public List<Chart> getAllChartData() {
        return chartDataRepository.findAll();
    }
}

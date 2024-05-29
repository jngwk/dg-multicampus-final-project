package com.dg.deukgeun.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.ChartDataDTO;
import com.dg.deukgeun.service.ChartDataService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/charts")
public class ChartController {
    @Autowired
    private ChartDataService chartDataService;

    @GetMapping("/data")
    public List<ChartDataDTO> getData() {
        return chartDataService.getAllChartData().stream()
                .map(chartData -> new ChartDataDTO(chartData.getLabel(), chartData.getValue()))
                .collect(Collectors.toList());
    }
}
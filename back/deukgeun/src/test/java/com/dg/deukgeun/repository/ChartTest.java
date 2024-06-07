package com.dg.deukgeun.repository;

import java.util.Random;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.entity.Chart;

@SpringBootTest

public class ChartTest {

    @Autowired
    private ChartDataRepository chartDataRepository;

    @Test
    public void testInsertData() {
        Random random = new Random();
        for (int i = 1; i <= 12; i++) {
            Chart chartData = Chart.builder()
                    .label(String.valueOf(i))
                    .value(random.nextInt(100) + 1)
                    .build();
            chartDataRepository.save(chartData);
        }
    }
}

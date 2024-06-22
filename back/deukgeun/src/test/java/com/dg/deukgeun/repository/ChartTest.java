// package com.dg.deukgeun.repository;

// import java.util.Random;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;

// import com.dg.deukgeun.entity.Chart;

// @SpringBootTest

// public class ChartTest {

//     @Autowired
//     private ChartDataRepository chartDataRepository;

<<<<<<< HEAD
//     @Test
//     public void testInsertData() {
//         Random random = new Random();
//         for (int i = 1; i <= 12; i++) {
//             Chart chartData = Chart.builder()
//                     .label(String.valueOf(i))
//                     .value(random.nextInt(100) + 1)
//                     .build();
//             chartDataRepository.save(chartData);
//         }
//     }
// }
=======
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
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

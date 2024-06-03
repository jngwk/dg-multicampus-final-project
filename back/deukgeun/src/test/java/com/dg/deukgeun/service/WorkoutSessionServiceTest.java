package com.dg.deukgeun.service;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.dto.WorkoutSessionDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class WorkoutSessionServiceTest {
    @Autowired
    private WorkoutSessionService workoutSessionService;

    @Test
    public void testGet(){
        List<WorkoutSessionDTO> dtoList = workoutSessionService.get("2024-06-01","2024-07-01");
        log.info(dtoList);
    }
}

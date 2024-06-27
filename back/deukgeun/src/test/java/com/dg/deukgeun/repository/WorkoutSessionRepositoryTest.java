package com.dg.deukgeun.repository;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.entity.WorkoutSession;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class WorkoutSessionRepositoryTest {
    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    // @Test
    // public void findByworkoutDate(){
    // List<WorkoutSession> wsList =
    // workoutSessionRepository.findByUserIdAndWorkoutDateBetween(1,LocalDate.parse("2024-06-01"),
    // LocalDate.parse("2024-07-01"));
    // log.info(wsList);
    // }
}

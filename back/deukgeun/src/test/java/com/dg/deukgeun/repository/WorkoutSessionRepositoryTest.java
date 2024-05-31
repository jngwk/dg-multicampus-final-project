package com.dg.deukgeun.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.service.WorkoutSessionRepository;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class WorkoutSessionRepositoryTest {
    @Autowired
    WorkoutSessionRepository workoutSessionRepository;
}

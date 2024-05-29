package com.dg.deukgeun;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.repository.WorkoutSessionRepository;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class WorkoutSessionRepositoryTest {
    @Autowired
    WorkoutSessionRepository workoutSessionRepository;
}

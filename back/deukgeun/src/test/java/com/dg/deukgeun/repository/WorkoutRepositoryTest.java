package com.dg.deukgeun.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.entity.Workout;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class WorkoutRepositoryTest {
    @Autowired
    private WorkoutRepository workoutRepository;

    @Test
    public void repositoryTest(){
        log.info("--------------------");
        log.info(workoutRepository);
    }

    @Test
    public void testInsert(){
        Workout workout = Workout.builder().workoutSessionId(null).workoutName("삼두").build();
        workoutRepository.save(workout);
    }
}

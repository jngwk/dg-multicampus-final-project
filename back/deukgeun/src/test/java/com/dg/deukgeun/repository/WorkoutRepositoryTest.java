package com.dg.deukgeun.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import com.dg.deukgeun.Entity.PtSession;
import com.dg.deukgeun.Entity.Workout;
import com.dg.deukgeun.Entity.WorkoutSession;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@Log4j2
public class WorkoutRepositoryTest {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    @Autowired
    private PtSessionRepository ptSessionRepository;

    private WorkoutSession workoutSession;
    private PtSession ptSession;

    @BeforeEach
    void setUp() {
        workoutSession = new WorkoutSession();
        workoutSession.setDate(LocalDate.now());
        workoutSession.setContent("Test Content");
        workoutSession.setBodyWeight(70.5);
        workoutSession.setMemo("Test Memo");

        // PT 세션 저장
        ptSession = new PtSession();
        ptSession.setStartTime(LocalDateTime.now()); // 예시로 현재 시간 설정
        ptSession.setEndTime(LocalDateTime.now().plusHours(1)); // 예시로 현재 시간으로부터 1시간 뒤 설정
        ptSessionRepository.save(ptSession);
        workoutSession.setPtSession(ptSession);

        workoutSessionRepository.save(workoutSession);

        log.info("WorkoutSession and PtSession setup complete");
    }

    @Test
    @Transactional
    void testCreateAndFindWorkout() throws Exception {
        Workout workout = new Workout();
        workout.setWorkoutSession(workoutSession);
        workout.setWorkoutName("Bench Press");
        workout.setWorkoutSet(3);
        workout.setWorkoutRep(12);
        workout.setWeight(75.0);
        
        workoutRepository.save(workout);
        
        log.info("Workout saved: {}", workout);
    
        List<Workout> workouts = workoutRepository.findAll();
        
        log.info("Found workouts: {}", workouts);
    
        assertEquals(1, workouts.size());
        assertEquals("Bench Press", workouts.get(0).getWorkoutName());
    
        // 객체를 JSON으로 변환하여 출력
        String workoutJson = new ObjectMapper().writeValueAsString(workouts.get(0));
        log.info("Workout JSON: {}", workoutJson);
        
        //workoutSession 정보 json 변혼 출력
        String workoutSessionJson = new ObjectMapper().writeValueAsString(workouts.get(0).getWorkoutSession());
        log.info("WorkoutSession JSON: {}", workoutSessionJson);


        log.info("-------------------success");
    }
}
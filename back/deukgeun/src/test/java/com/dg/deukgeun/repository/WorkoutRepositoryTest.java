package com.dg.deukgeun.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Commit;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import com.dg.deukgeun.Entity.PtSession;
import com.dg.deukgeun.Entity.Workout;
import com.dg.deukgeun.Entity.WorkoutSession;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@Log4j2
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
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
    @Commit
    @Transactional
    @Test
    public void setUp() {
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
    public void testCreateAndFindWorkout() throws Exception {
    // 새로운 Workout 객체 생성
        Workout workout = new Workout();
        workout.setWorkoutSession(workoutSession);
        workout.setWorkoutName("Bench Press");
        workout.setWorkoutSet(3);
        workout.setWorkoutRep(12);
        workout.setWeight(75.0);
    
    // Workout 객체 저장
        workoutRepository.save(workout);
    
        log.info("Workout saved: {}", workout);
    
    // 저장된 Workout 객체를 읽어옴
        List<Workout> workouts = workoutRepository.findAll();
    
        log.info("Found workouts: {}", workouts);
    
    // 저장된 Workout 객체의 속성 값 로깅
        for (Workout savedWorkout : workouts) {
            log.info("Workout: ID={}, Name={}, Set={}, Rep={}, Weight={}",
                 savedWorkout.getWorkoutId(), savedWorkout.getWorkoutName(),
                 savedWorkout.getWorkoutSet(), savedWorkout.getWorkoutRep(),
                 savedWorkout.getWeight());
        }
    
        assertEquals(1, workouts.size());
        assertEquals("Bench Press", workouts.get(0).getWorkoutName());
    
        log.info("-------------------success");
    }
}
// package com.dg.deukgeun.repository;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.List;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
// import org.springframework.test.annotation.Commit;
// import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
// import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
// import com.dg.deukgeun.Entity.PtSession;
// import com.dg.deukgeun.Entity.UserEntity;
// import com.dg.deukgeun.Entity.Workout;
// import com.dg.deukgeun.Entity.WorkoutSession;
// import com.dg.deukgeun.dto.UserRole;
// import com.dg.deukgeun.service.WorkoutSessionRepository;

// import jakarta.transaction.Transactional;
// import lombok.extern.log4j.Log4j2;

// @Log4j2
// @DataJpaTest
// @AutoConfigureTestDatabase(replace = Replace.ANY)
// public class WorkoutRepositoryTest {

//     @Autowired
//     private WorkoutRepository workoutRepository;

//     @Autowired
//     private WorkoutSessionRepository workoutSessionRepository;

//     @Autowired
//     private PtSessionRepository ptSessionRepository;

//     @Autowired
//     private UserRepository userRepository;

//     private UserEntity savedUser;
//     private WorkoutSession savedWorkoutSession;
//     private PtSession savedPtSession;

//     @BeforeEach
//     @Commit
//     @Transactional
//     public void setUp() {
//         // 사용자 데이터 저장
//         UserEntity user = UserEntity.builder()
//                 .userName("John Doe")
//                 .email("john.doe@example.com")
//                 .address("123 Main St")
//                 .category("Fitness")
//                 .password("password")
//                 .approval(1)
//                 .role(UserRole.USER)
//                 .build();
        
//         savedUser = userRepository.save(user);

//         // PT 세션 설정 및 저장
//         PtSession ptSession = new PtSession();
//         ptSession.setStartTime(LocalDateTime.now()); // 예시로 현재 시간 설정
//         ptSession.setEndTime(LocalDateTime.now().plusHours(1)); // 예시로 현재 시간으로부터 1시간 뒤 설정
//         savedPtSession = ptSessionRepository.save(ptSession);

//         // WorkoutSession 설정
//         WorkoutSession workoutSession = new WorkoutSession();
//         workoutSession.setDate(LocalDate.now());
//         workoutSession.setContent("Test Content");
//         workoutSession.setBodyWeight(70.5);
//         workoutSession.setMemo("Test Memo");
//         workoutSession.setUser(savedUser);
//         workoutSession.setPtSession(savedPtSession);
//         savedWorkoutSession = workoutSessionRepository.save(workoutSession);

//         log.info("WorkoutSession and PtSession setup complete");
//     }

//     @Test
//     public void testInsertUser() {
//         // given
//         UserEntity user = UserEntity.builder()
//                 .userName("John Doe")
//                 .email("john.doe@example.com")
//                 .address("123 Main St")
//                 .category("Fitness")
//                 .password("password")
//                 .approval(1)
//                 .role(UserRole.USER)
//                 .build();

//         // when
//         UserEntity savedUser = userRepository.save(user);

//         // then
//         assertNotNull(savedUser);
//         assertNotNull(savedUser.getUserId());
//         assertEquals("John Doe", savedUser.getUserName());
//         assertEquals("john.doe@example.com", savedUser.getEmail());
//         assertEquals("123 Main St", savedUser.getAddress());
//         assertEquals("Fitness", savedUser.getCategory());
//         assertEquals("password", savedUser.getPassword());
//         assertEquals(1, savedUser.getApproval());
//         assertEquals(UserRole.USER, savedUser.getRole());
//     }

//     @Test
//     public void testCreateAndFindWorkout() throws Exception {
//         // 새로운 Workout 객체 생성
//         Workout workout = new Workout();
//         workout.setWorkoutSession(savedWorkoutSession);
//         workout.setWorkoutName("Bench Press");
//         workout.setWorkoutSet(3);
//         workout.setWorkoutRep(12);
//         workout.setWeight(75.0);

//         // Workout 객체 저장
//         workoutRepository.save(workout);

//         log.info("Workout saved: {}", workout);

//         // 저장된 Workout 객체를 읽어옴
//         List<Workout> workouts = workoutRepository.findAll();

//         log.info("Found workouts: {}", workouts);

//         // 저장된 Workout 객체의 속성 값 로깅
//         for (Workout savedWorkout : workouts) {
//             log.info("Workout: ID={}, Name={}, Set={}, Rep={}, Weight={}",
//                     savedWorkout.getWorkoutId(), savedWorkout.getWorkoutName(),
//                     savedWorkout.getWorkoutSet(), savedWorkout.getWorkoutRep(),
//                     savedWorkout.getWeight());
//         }

//         assertEquals(1, workouts.size());
//         assertEquals("Bench Press", workouts.get(0).getWorkoutName());

//         log.info("-------------------success");
//     }
// }
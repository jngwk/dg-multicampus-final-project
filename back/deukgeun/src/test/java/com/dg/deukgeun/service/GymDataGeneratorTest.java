package com.dg.deukgeun.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class GymDataGeneratorTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final Random random = new Random();
    private final LocalDate startDate = LocalDate.now().minusYears(1);
    private final LocalDate endDate = LocalDate.now();

    @Test
    public void generateTestData() {
        checkConstraints();
    removeAllUniqueConstraints();
    ensureWorkoutSessionIdIsPrimaryKeyAutoIncrement();
    deleteExistingData();

    createProducts();
    createAdditionalTrainers();
    createAdditionalUsers();
    createMemberships();
    createPersonalTrainings();
    createPtSessions();
    createWorkoutSessions();
    createWorkouts();

        System.out.println("테스트 데이터 생성 완료");
    }

    private void createProducts() {
        String[] productNames = {"1개월 이용권", "3개월 이용권", "6개월 이용권", "1개월 PT 10회", "3개월 PT 30회", "6개월 PT 50회"};
        int[] days = {30, 90, 180, 30, 90, 180};
        int[] prices = {100000, 270000, 500000, 300000, 800000, 1500000};
        int[] ptCounts = {0, 0, 0, 10, 30, 50};
    
        for (int i = 0; i < productNames.length; i++) {
            jdbcTemplate.update(
                "INSERT INTO product (product_id, days, price, product_name, pt_count_total, status, gym_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                i + 1, days[i], prices[i], productNames[i], ptCounts[i], true, 1
            );
        }
    }

    private void deleteExistingData() {
        jdbcTemplate.update("DELETE FROM workout");
        jdbcTemplate.update("DELETE FROM workout_session");
        jdbcTemplate.update("DELETE FROM pt_session");
        jdbcTemplate.update("DELETE FROM personal_training");
        jdbcTemplate.update("DELETE FROM membership WHERE membership_id > 3");
        jdbcTemplate.update("DELETE FROM users WHERE user_id > 3");
    }

    private void createAdditionalTrainers() {
        String[] trainerAbouts = {
            "체계적인 트레이닝으로 여러분의 목표 달성을 도와드립니다.",
            "건강한 라이프스타일을 위한 맞춤 운동 프로그램을 제공합니다.",
            "과학적인 접근으로 효과적인 운동 방법을 지도합니다."
        };
        String[] careers = {"6개월 미만", "1년", "2년", "3년", "4년", "5년", "6년", "7년", "8년"};

        for (int i = 0; i < 2; i++) {
            int userId = 4 + i;
            jdbcTemplate.update(
                "INSERT INTO users (user_id, email, password, role, user_name, address, detail_address) VALUES (?, ?, ?, ?, ?, ?, ?)",
                userId, "trainer" + userId + "@example.com", "password", "ROLE_TRAINER", "트레이너" + userId, "주소" + userId, "상세주소" + userId
            );

            jdbcTemplate.update(
                "INSERT INTO trainers (trainer_about, trainer_career, gym_id, user_id) VALUES (?, ?, ?, ?)",
                trainerAbouts[i], careers[random.nextInt(careers.length)], 1, userId
            );
        }
    }

    private void createAdditionalUsers() {
        for (int i = 0; i < 30; i++) {
            int userId = 6 + i;
            jdbcTemplate.update(
                "INSERT INTO users (user_id, email, password, role, user_name, address, detail_address) VALUES (?, ?, ?, ?, ?, ?, ?)",
                userId, "user" + userId + "@example.com", "password", "ROLE_GENERAL", "사용자" + userId, "주소" + userId, "상세주소" + userId
            );
        }
    }

    private void createMemberships() {
        String[] genders = {"남성", "여성"};
        String[] reasons = {"체중 감량", "근력 향상", "건강 유지", "스트레스 해소"};
        String[] durations = {"1개월 미만", "1-3개월", "3-6개월", "6개월 이상"};
        int[] productIds = {1, 2, 3, 4, 5, 6};

        List<Integer> userIds = jdbcTemplate.queryForList("SELECT user_id FROM users WHERE role = 'ROLE_GENERAL'", Integer.class);

        for (int userId : userIds) {
            LocalDate regDate = generateWeightedRandomDate();
            int productId = productIds[random.nextInt(productIds.length)];
            LocalDate expDate = calculateExpDate(regDate, productId);

            jdbcTemplate.update(
                "INSERT INTO membership (exp_date, reg_date, user_age, user_gender, user_member_reason, user_workout_duration, gym_id, user_id, product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                expDate, regDate, generateAge(), genders[random.nextInt(2)], reasons[generateWeightedIndex(new int[]{40, 30, 20, 10})],
                durations[random.nextInt(durations.length)], 1, userId, productId
            );
        }
    }

    private void createPersonalTrainings() {
        String[] reasons = {"체력 향상", "다이어트", "근육 증가", "자세 교정"};

        List<Map<String, Object>> memberships = jdbcTemplate.queryForList(
            "SELECT membership_id, product_id, user_id FROM membership WHERE product_id IN (4, 5, 6)"
        );

        for (Map<String, Object> membership : memberships) {
            int productId = (int) membership.get("product_id");
            int ptCount = getPtCount(productId);

            jdbcTemplate.update(
                "INSERT INTO personal_training (membership_id, pt_content, pt_count_remain, pt_count_total, user_pt_reason, trainer_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                membership.get("membership_id"), "PT 프로그램", ptCount, ptCount, reasons[random.nextInt(reasons.length)],
                getRandomTrainerId(), membership.get("user_id")
            );
        }
    }

    private void createPtSessions() {
        List<Map<String, Object>> personalTrainings = jdbcTemplate.queryForList(
            "SELECT pt_id, pt_count_total, trainer_id FROM personal_training"
        );

        for (Map<String, Object> pt : personalTrainings) {
            int ptId = (int) pt.get("pt_id");
            int ptCountTotal = (int) pt.get("pt_count_total");
            int trainerId = (int) pt.get("trainer_id");

            for (int i = 0; i < ptCountTotal; i++) {
                jdbcTemplate.update(
                    "INSERT INTO pt_session (memo, pt_id, trainer_id) VALUES (?, ?, ?)",
                    "PT 세션 메모", ptId, trainerId
                );
            }
        }
    }

    private void checkConstraints() {
        List<Map<String, Object>> constraints = jdbcTemplate.queryForList(
            "SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'workout_session'"
        );
        for (Map<String, Object> constraint : constraints) {
            System.out.println("Constraint: " + constraint.get("CONSTRAINT_NAME") + ", Type: " + constraint.get("CONSTRAINT_TYPE"));
        }
    }
    private void removeAllUniqueConstraints() {
        List<String> uniqueConstraints = jdbcTemplate.queryForList(
            "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'workout_session' AND CONSTRAINT_TYPE = 'UNIQUE'",
            String.class
        );
        for (String constraintName : uniqueConstraints) {
            jdbcTemplate.execute("ALTER TABLE workout_session DROP INDEX " + constraintName);
            System.out.println("Dropped constraint: " + constraintName);
        }
    }
    private void ensureWorkoutSessionIdIsPrimaryKeyAutoIncrement() {
        jdbcTemplate.execute("ALTER TABLE workout_session MODIFY COLUMN workout_session_id INT AUTO_INCREMENT PRIMARY KEY");
    }

    private void createWorkoutSessions() {
        List<Map<String, Object>> memberships = jdbcTemplate.queryForList(
            "SELECT m.membership_id, m.reg_date, m.exp_date, m.user_id, pt.pt_id FROM membership m LEFT JOIN personal_training pt ON m.membership_id = pt.membership_id"
        );
    
        for (Map<String, Object> membership : memberships) {
            LocalDate regDate = LocalDate.parse((String) membership.get("reg_date"));
            LocalDate expDate = LocalDate.parse((String) membership.get("exp_date"));
            int userId = (int) membership.get("user_id");
            Integer ptId = (Integer) membership.get("pt_id");
    
            int sessionCount = random.nextInt(41) + 10; // 10-50 sessions per user
            for (int i = 0; i < sessionCount; i++) {
                LocalDate sessionDate = generateRandomDateBetween(regDate, expDate);
                LocalTime startTime = generateWeightedRandomTime();
                LocalTime endTime = startTime.plusHours(1);
    
                Integer ptSessionId = null;
                if (ptId != null) {
                    List<Integer> ptSessionIds = jdbcTemplate.queryForList(
                        "SELECT pt_session_id FROM pt_session WHERE pt_id = ?", Integer.class, ptId
                    );
                    if (!ptSessionIds.isEmpty()) {
                        ptSessionId = ptSessionIds.get(random.nextInt(ptSessionIds.size()));
                    }
                }
    
                jdbcTemplate.update(
                    "INSERT INTO workout_session (body_weight, content, end_time, memo, start_time, workout_date, pt_session_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    generateBodyWeight(), "운동 세션 내용", endTime, "운동 메모", startTime, sessionDate, ptSessionId, userId
                );
            }
        }
    }
    

    private void createWorkouts() {
        String[] workoutNames = {"벤치프레스", "스쿼트", "데드리프트", "숄더프레스", "랫풀다운"};

        List<Integer> workoutSessionIds = jdbcTemplate.queryForList("SELECT workout_session_id FROM workout_session", Integer.class);

        for (int workoutSessionId : workoutSessionIds) {
            int workoutCount = random.nextInt(3) + 3; // 3-5 workouts per session
            for (int i = 0; i < workoutCount; i++) {
                jdbcTemplate.update(
                    "INSERT INTO workout (workout_name, workout_rep, workout_session_id, workout_set, workout_weight) VALUES (?, ?, ?, ?, ?)",
                    workoutNames[random.nextInt(workoutNames.length)], random.nextInt(6) + 5, workoutSessionId,
                    random.nextInt(3) + 3, random.nextInt(61) + 20
                );
            }
        }
    }

    private LocalDate generateWeightedRandomDate() {
        LocalDate date;
        do {
            long randomDay = startDate.toEpochDay() + random.nextInt((int) (endDate.toEpochDay() - startDate.toEpochDay() + 1));
            date = LocalDate.ofEpochDay(randomDay);
        } while (!isWeightedDate(date));
        return date;
    }

    private boolean isWeightedDate(LocalDate date) {
        int month = date.getMonthValue();
        double chance = (month == 1 || (month >= 3 && month <= 5) || (month >= 9 && month <= 10)) ? 0.7 : 0.3;
        return random.nextDouble() < chance;
    }

    private LocalDate calculateExpDate(LocalDate regDate, int productId) {
        int months = (productId <= 3) ? productId : (productId - 3) * 3;
        return regDate.plusMonths(months);
    }

    private int generateAge() {
        int[] ages = {20, 30, 40, 50};
        int[] weights = {40, 30, 20, 10};
        return ages[generateWeightedIndex(weights)] + random.nextInt(10);
    }

    private int generateWeightedIndex(int[] weights) {
        int total = Arrays.stream(weights).sum();
        int randomValue = random.nextInt(total);
        int sum = 0;
        for (int i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (randomValue < sum) {
                return i;
            }
        }
        return weights.length - 1;
    }

    private int getRandomTrainerId() {
        List<Integer> trainerIds = jdbcTemplate.queryForList("SELECT trainer_id FROM trainers", Integer.class);
        return trainerIds.get(random.nextInt(trainerIds.size()));
    }

    private int getPtCount(int productId) {
        switch (productId) {
            case 4: return 10;
            case 5: return 30;
            case 6: return 50;
            default: return 0;
        }
    }

    private LocalDate generateRandomDateBetween(LocalDate start, LocalDate end) {
        long startEpochDay = start.toEpochDay();
        long endEpochDay = end.toEpochDay();
        long randomDay = startEpochDay + random.nextInt((int) (endEpochDay - startEpochDay + 1));
        return LocalDate.ofEpochDay(randomDay);
    }

    private LocalTime generateWeightedRandomTime() {
        int hour;
        double rand = random.nextDouble();
        if (rand < 0.3) {
            hour = 6 + random.nextInt(4); // 오전 6-9시
        } else if (rand < 0.8) {
            hour = 18 + random.nextInt(5); // 오후 6-10시
        } else {
            hour = random.nextInt(24);
        }
        int minute = random.nextInt(2) * 30; // 0 또는 30분
        return LocalTime.of(hour, minute);
    }

    private double generateBodyWeight() {
        return 50 + random.nextInt(51) + Math.round(random.nextDouble() * 10) / 10.0; // 50.0-100.0 kg
    }
}
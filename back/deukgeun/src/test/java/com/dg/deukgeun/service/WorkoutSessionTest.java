// package com.dg.deukgeun.service;

// import java.sql.Connection;
// import java.sql.DriverManager;
// import java.sql.PreparedStatement;
// import java.sql.ResultSet;
// import java.sql.SQLException;
// import java.time.LocalDate;
// import java.time.LocalTime;
// import java.time.temporal.ChronoUnit;
// import java.util.ArrayList;
// import java.util.List;
// import java.util.Random;

// import org.junit.jupiter.api.Test;

// import com.dg.deukgeun.entity.PtSession;
// import com.dg.deukgeun.entity.User;
// import com.dg.deukgeun.entity.WorkoutSession;

// public class WorkoutSessionTest {

//     private static final LocalDate START_DATE = LocalDate.of(2023, 4, 1);
//     private static final LocalDate END_DATE = LocalDate.now();
//     private static final int NUM_ENTRIES = 300;
//     private static final Random RANDOM = new Random();

//     @Test
//     public void testInsertDummyData() throws SQLException {
//         Connection connection = getConnection();

//         int maxPtSessionId = getMaxPtSessionId(connection);
//         List<PtSession> ptSessions = generatePtSessions(NUM_ENTRIES, maxPtSessionId);
//         insertPtSessionsIntoDatabase(ptSessions, connection);

//         List<WorkoutSession> workoutSessions = generateDummyData(NUM_ENTRIES, ptSessions);
//         insertDummyDataIntoDatabase(workoutSessions, connection);

//         connection.close();
//     }

//     private static Connection getConnection() throws SQLException {
//         String url = "jdbc:mysql://localhost:3306/dgdb";
//         String user = "deukgeun";
//         String password = "deukgeun";
//         return DriverManager.getConnection(url, user, password);
//     }

//     private static int getMaxPtSessionId(Connection connection) throws SQLException {
//         String query = "SELECT COALESCE(MAX(pt_session_id), 0) FROM pt_session";
//         PreparedStatement statement = connection.prepareStatement(query);
//         ResultSet resultSet = statement.executeQuery();
//         resultSet.next();
//         int maxId = resultSet.getInt(1);
//         resultSet.close();
//         statement.close();
//         return maxId;
//     }

//     private static List<PtSession> generatePtSessions(int numEntries, int startId) {
//         List<PtSession> ptSessions = new ArrayList<>();
//         for (int i = 0; i < numEntries; i++) {
//             PtSession ptSession = new PtSession();
//             ptSession.setPtSessionId(startId + i + 1);
//             // Add any other required attributes for PtSession
//             ptSessions.add(ptSession);
//         }
//         return ptSessions;
//     }

//     private static void insertPtSessionsIntoDatabase(List<PtSession> ptSessions, Connection connection) throws SQLException {
//         String query = "INSERT INTO pt_session (pt_session_id) VALUES (?)"; // Add other columns if needed
//         PreparedStatement statement = connection.prepareStatement(query);

//         for (PtSession ptSession : ptSessions) {
//             statement.setInt(1, ptSession.getPtSessionId());
//             // Set other columns if needed
//             statement.addBatch();
//         }

//         statement.executeBatch();
//         statement.close();
//     }

//     private static List<WorkoutSession> generateDummyData(int numEntries, List<PtSession> ptSessions) {
//         List<WorkoutSession> workoutSessions = new ArrayList<>();

//         User user = new User();
//         user.setUserId(1); // assuming user with ID 1 exists

//         for (int i = 0; i < numEntries; i++) {
//             LocalDate workoutDate = weightedRandomDate(START_DATE, END_DATE);
//             String content = RANDOM.nextBoolean() ? "상체" : "하체";
//             Double bodyWeight = Math.round((50 + (RANDOM.nextDouble() * 40)) * 10) / 10.0; // 50 to 90 kg with one decimal
//             LocalTime startTime = generateRandomStartTime(RANDOM);
//             if (startTime != null) {
//                 LocalTime endTime = startTime.plusHours(1); // End time 1 hour after start time

//                 PtSession ptSession = ptSessions.get(i);

//                 WorkoutSession session = WorkoutSession.builder()
//                     .user(user)
//                     .ptSession(ptSession)
//                     .workoutDate(workoutDate)
//                     .content(content)
//                     .bodyWeight(bodyWeight)
//                     .memo(null)
//                     .startTime(startTime)
//                     .endTime(endTime)
//                     .build();

//                 workoutSessions.add(session);
//             }
//         }

//         return workoutSessions;
//     }

//     private static LocalDate weightedRandomDate(LocalDate start, LocalDate end) {
//         long days = ChronoUnit.DAYS.between(start, end);
//         LocalDate date = start.plusDays(RANDOM.nextInt((int) days + 1));

//         // Bias for spring and summer
//         if (date.getMonthValue() >= 4 && date.getMonthValue() <= 8) {
//             if (RANDOM.nextDouble() < 0.7) { // 70% chance to keep the date
//                 return date;
//             } else {
//                 return weightedRandomDate(start, end);
//             }
//         } else {
//             if (RANDOM.nextDouble() < 0.3) { // 30% chance to keep the date
//                 return date;
//             } else {
//                 return weightedRandomDate(start, end);
//             }
//         }
//     }

//     private static LocalTime generateRandomStartTime(Random random) {
//         int hour;
//         int minute = random.nextInt(2) * 30; // 0 or 30

//         int timeSlot = random.nextInt(100);
//         if (timeSlot < 20) {
//             hour = 5 + random.nextInt(4); // 05:00 to 08:00
//         } else if (timeSlot < 90) {
//             hour = 17 + random.nextInt(5); // 17:00 to 21:00
//         } else {
//             hour = 5 + random.nextInt(17); // 05:00 to 21:00
//         }
//         if (hour >= 5 && hour <= 21) {
//             return LocalTime.of(hour, minute);
//         } else {
//             return null;
//         }
//     }

//     private static void insertDummyDataIntoDatabase(List<WorkoutSession> workoutSessions, Connection connection) throws SQLException {
//         String query = "INSERT INTO workout_session (user_id, pt_session_id, workout_date, content, body_weight, memo, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//         PreparedStatement statement = connection.prepareStatement(query);

//         for (WorkoutSession session : workoutSessions) {
//             statement.setInt(1, session.getUser().getUserId());
//             statement.setInt(2, session.getPtSession().getPtSessionId());
//             statement.setDate(3, java.sql.Date.valueOf(session.getWorkoutDate()));
//             statement.setString(4, session.getContent());
//             statement.setDouble(5, session.getBodyWeight());
//             statement.setString(6, session.getMemo());
//             statement.setTime(7, java.sql.Time.valueOf(session.getStartTime()));
//             statement.setTime(8, java.sql.Time.valueOf(session.getEndTime()));
//             statement.addBatch();
//         }

//         statement.executeBatch();
//         statement.close();
//     }
// }

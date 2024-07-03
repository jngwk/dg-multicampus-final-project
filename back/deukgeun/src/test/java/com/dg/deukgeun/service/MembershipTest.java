package com.dg.deukgeun.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;

class Membership {
    int membershipId;
    LocalDate expDate;
    LocalDate regDate;
    int userAge;
    String userGender;
    String userMemberReason;
    int userWorkoutDuration;
    int gymId;
    int userId;
    int productId;

    // Constructor
    public Membership(int membershipId, LocalDate expDate, LocalDate regDate, int userAge, String userGender, String userMemberReason, int userWorkoutDuration, int gymId, int userId, int productId) {
        this.membershipId = membershipId;
        this.expDate = expDate;
        this.regDate = regDate;
        this.userAge = userAge;
        this.userGender = userGender;
        this.userMemberReason = userMemberReason;
        this.userWorkoutDuration = userWorkoutDuration;
        this.gymId = gymId;
        this.userId = userId;
        this.productId = productId;
    }
}

public class MembershipTest {

    private static final LocalDate START_DATE = LocalDate.of(2023, 3, 23);
    private static final LocalDate END_DATE = LocalDate.now();
    private static final int NUM_ENTRIES = 100;
    private static final Random RANDOM = new Random();
    private static final int START_MEMBERSHIP_ID = 156; // Starting membership_id

    @Test
    public void testInsertDummyData() throws SQLException {
        List<Membership> memberships = generateDummyData(NUM_ENTRIES);
        insertDummyDataIntoDatabase(memberships);
    }

    private static List<Membership> generateDummyData(int numEntries) {
        List<Membership> memberships = new ArrayList<>();

        for (int i = 0; i < numEntries; i++) {
            LocalDate regDate = weightedRandomDate(START_DATE, END_DATE);
            int productId = RANDOM.nextInt(3) + 1;
            LocalDate expDate = calculateExpDate(regDate, productId);
            int userAge = RANDOM.nextInt(21) + 20;
            int userWorkoutDuration = userAge - 20 + RANDOM.nextInt(11);
            String userGender = RANDOM.nextBoolean() ? "남성" : "여성";
            String userMemberReason = randomMemberReason();

            int membershipId = START_MEMBERSHIP_ID + i;

            memberships.add(new Membership(
                    membershipId,
                    expDate,
                    regDate,
                    userAge,
                    userGender,
                    userMemberReason,
                    userWorkoutDuration,
                    1, // gymId is fixed to 1
                    1, // userId is fixed to 1
                    productId
            ));
        }

        return memberships;
    }

    private static LocalDate weightedRandomDate(LocalDate start, LocalDate end) {
        long days = ChronoUnit.DAYS.between(start, end);
        LocalDate date = start.plusDays(RANDOM.nextInt((int) days + 1));

        // Bias for spring and summer
        if (date.getMonthValue() >= 3 && date.getMonthValue() <= 8) {
            if (RANDOM.nextDouble() < 0.7) {  // 70% chance to keep the date
                return date;
            } else {
                return weightedRandomDate(start, end);
            }
        } else {
            if (RANDOM.nextDouble() < 0.3) {  // 30% chance to keep the date
                return date;
            } else {
                return weightedRandomDate(start, end);
            }
        }
    }

    private static LocalDate calculateExpDate(LocalDate regDate, int productId) {
        switch (productId) {
            case 1:
                return regDate.plusMonths(1);
            case 2:
                return regDate.plusMonths(3);
            case 3:
                return regDate.plusMonths(6);
            default:
                throw new IllegalArgumentException("Invalid productId");
        }
    }

    private static String randomMemberReason() {
        String[] reasons = {"다이어트", "건강", "PT", "체형관리", "바디프로필"};
        return reasons[RANDOM.nextInt(reasons.length)];
    }

    private static void insertDummyDataIntoDatabase(List<Membership> memberships) throws SQLException {
        String url = "jdbc:mysql://localhost:3306/dgdb";
        String user = "scott";
        String password = "tiger";

        Connection connection = DriverManager.getConnection(url, user, password);

        String query = "INSERT INTO membership (membership_id, exp_date, reg_date, user_age, user_gender, user_member_reason, user_workout_duration, gym_id, user_id, product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement statement = connection.prepareStatement(query);

        for (Membership membership : memberships) {
            statement.setInt(1, membership.membershipId);
            statement.setDate(2, java.sql.Date.valueOf(membership.expDate));
            statement.setDate(3, java.sql.Date.valueOf(membership.regDate));
            statement.setInt(4, membership.userAge);
            statement.setString(5, membership.userGender);
            statement.setString(6, membership.userMemberReason);
            statement.setInt(7, membership.userWorkoutDuration);
            statement.setInt(8, membership.gymId);
            statement.setInt(9, membership.userId);
            statement.setInt(10, membership.productId);
            statement.addBatch();
        }

        statement.executeBatch();
        statement.close();
        connection.close();
    }
}

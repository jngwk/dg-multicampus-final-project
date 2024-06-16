package com.dg.deukgeun.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "membership")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer membershipId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // @ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    private String regDate;
    private String expDate;
    private String userMemberReason;
    private String userGender;
    private Integer userAge;
    private String userWorkoutDuration;

    public static class MembershipBuilder {
        private User user;

        public MembershipBuilder user(User user) {
            this.user = user;
            return this;
        }
    }
}

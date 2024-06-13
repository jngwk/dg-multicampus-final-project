package com.dg.deukgeun.dto.gym;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MembershipDTO {
    private Integer membershipId;

    private Integer userId;
    private Integer gymId;

    private String regDate;
    private String expDate;
    private String userMemberReason;
    private String userGender;
    private Integer userAge;
    private String userWorkoutDuration;
}
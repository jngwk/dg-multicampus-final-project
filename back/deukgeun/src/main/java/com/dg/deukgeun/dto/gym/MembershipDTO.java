package com.dg.deukgeun.dto.gym;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MembershipDTO {
    private Integer membershipId;

    private Integer userId;
    private Integer gymId;

    private String regDate;
    private String expDate;
    private String userMemberReason;
    private Integer userAge;
    private String userWorkoutDuration;
    
    //filter
    private String userGender;

    private Integer productId;
    
    private String impUid;
}

/*
 *  file from gachudon
 *  체육관 정보가 필요할 때 사용
 */

package com.dg.deukgeun.dto.gym;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymDTO {
    private Integer gymId;
    private String gymName;
    private Integer userId;
    private String crNumber;
    private String phoneNumber;
    private String address;
    private String detailAddress;
    private String operatingHours;
    private String prices;
    private String introduce;
    // private Integer approval;
}

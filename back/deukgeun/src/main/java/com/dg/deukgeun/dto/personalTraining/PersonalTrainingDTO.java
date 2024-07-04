package com.dg.deukgeun.dto.personalTraining;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PersonalTrainingDTO {
    private Integer ptId;
    private Integer userId;
    private Integer trainerId;
    private int ptCountTotal;
    private int ptCountRemain;
    private String ptContent;
    private String userPtReason;
}

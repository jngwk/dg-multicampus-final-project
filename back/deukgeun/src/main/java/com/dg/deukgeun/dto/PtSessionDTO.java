package com.dg.deukgeun.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PtSessionDTO {
    private Integer ptSessionId;
    private Integer ptId;
    private Integer trainerId;
    private String memo;
}

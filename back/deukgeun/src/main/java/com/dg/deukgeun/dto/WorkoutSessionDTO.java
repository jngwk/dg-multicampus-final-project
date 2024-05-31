package com.dg.deukgeun.dto;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutSessionDTO {
    private Integer workoutSessionId;
    private Integer userId;
    private Integer ptSessionId;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")
    private Date workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
}

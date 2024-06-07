package com.dg.deukgeun.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutDTO {
    private Integer workoutId;
    private Integer workoutSessionId;
    private String workoutName;
    private int workoutSet;
    private int workoutRep;
    private int weight;
}
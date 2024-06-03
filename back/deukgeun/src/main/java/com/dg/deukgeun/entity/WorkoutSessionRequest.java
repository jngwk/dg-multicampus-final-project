package com.dg.deukgeun.entity;

import java.time.LocalDate;
import java.util.List;

import com.dg.deukgeun.dto.WorkoutDTO;

import lombok.Data;

@Data
public class WorkoutSessionRequest {
    private Integer userId;
    private Integer ptSessionId;
    private LocalDate workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
    private List<WorkoutDTO> workout;
}

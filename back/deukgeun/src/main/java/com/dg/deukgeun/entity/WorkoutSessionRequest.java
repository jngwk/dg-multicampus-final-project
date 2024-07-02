package com.dg.deukgeun.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.dg.deukgeun.dto.WorkoutDTO;

import lombok.Data;

@Data
public class WorkoutSessionRequest {
    private Integer workoutSessionId;
    private Integer userId;
    private PtSession ptSession;
    private LocalDate workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<WorkoutDTO> workouts;
}

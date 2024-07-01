package com.dg.deukgeun.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.dg.deukgeun.entity.PtSession;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutSessionReqeustDTO {
    private Integer workoutSessionId;
    private Integer userId;
    private PtSession ptSession;
    private LocalDate workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
    private LocalTime startTime;
    private LocalTime endTime;
    @Builder.Default
    private List<WorkoutDTO> workouts = new ArrayList<>();
}

package com.dg.deukgeun.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutDto {
    private int workoutId;
    private int workoutSessionId;
    private String workoutName;
    private int set;
    private int rep;
    private double weight;
    private LocalDate workoutDate;
    private String workoutContent;
    private double bodyWeight;
    private String workoutMemo;
    private LocalDateTime sessionStartTime;
    private LocalDateTime sessionEndTime;
    private int trainerId;

}
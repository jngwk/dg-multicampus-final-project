package com.dg.deukgeun.dto;

import com.dg.deukgeun.entity.PtSession;
import com.dg.deukgeun.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;

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
    private PtSession ptSession;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;
}

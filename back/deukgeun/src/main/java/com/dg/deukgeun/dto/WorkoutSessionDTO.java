package com.dg.deukgeun.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.dg.deukgeun.entity.PtSession;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.lang.Nullable;

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
    @Nullable
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

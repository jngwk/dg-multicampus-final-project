package com.dg.deukgeun.dto;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

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
    private String memo;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate ptDate;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;
    private String color;
}

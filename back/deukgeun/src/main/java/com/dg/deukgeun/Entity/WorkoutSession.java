package com.dg.deukgeun.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="workout_session")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer workoutSessionId;
    private Integer userId;
    private Integer ptSessionId;
    private Date workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
}

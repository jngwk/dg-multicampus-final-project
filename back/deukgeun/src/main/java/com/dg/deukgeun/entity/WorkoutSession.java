package com.dg.deukgeun.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workout_session")
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
    private LocalDate workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
    private LocalTime startTime;
    private LocalTime endTime;

    @OneToMany(mappedBy = "workoutSessionId", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Workout> workouts;
}

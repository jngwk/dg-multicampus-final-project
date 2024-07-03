package com.dg.deukgeun.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pt_session_Id", nullable = true)
    private PtSession ptSession;
    private LocalDate workoutDate;
    private String content;
    private Double bodyWeight;
    private String memo;
    private LocalTime startTime;
    private LocalTime endTime;

    @OneToMany(mappedBy = "workoutSessionId", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Workout> workouts;
}

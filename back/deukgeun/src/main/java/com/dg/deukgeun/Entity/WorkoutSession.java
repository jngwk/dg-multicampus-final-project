package com.dg.deukgeun.Entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workoutSessionId;
    
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;

    private LocalDate date;
    private String content;
    private double bodyWeight;
    private String memo;

    @ManyToOne
    @JoinColumn(name = "pt_session_id", nullable = false)
    private PtSession ptSession;
    @OneToMany(mappedBy = "workoutSession", cascade = CascadeType.ALL)
    private List<Workout> workouts;

}

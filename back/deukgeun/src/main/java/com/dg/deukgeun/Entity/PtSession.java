package com.dg.deukgeun.Entity;

import java.time.LocalDateTime;
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
public class PtSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ptSessionId;

    // @ManyToOne
    // @JoinColumn(name = "trainerId", nullable = false)
    // private Trainer trainer;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "ptSession", cascade = CascadeType.ALL)
    private List<WorkoutSession> workoutSessions;

}

package com.dg.deukgeun.Entity;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workoutId;

    private String workoutName;
    private Integer workoutSet;
    private Integer workoutRep;
    private double weight;

    @ManyToOne
    @JoinColumn(name = "workout_session_id", nullable = false)
    private WorkoutSession workoutSession;



}

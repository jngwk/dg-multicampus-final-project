package com.dg.deukgeun.entity;

import com.dg.deukgeun.dto.gym.TrainerDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trainers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer trainerId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "gym_id")
    private Gym gym;

    private String trainerCareer;
    private String trainerAbout;
    private String trainerImage;

    public Trainer(TrainerDTO dto) {
        this.user = new User();
        this.gym = new Gym();
        this.trainerCareer = dto.getTrainerCareer();
        this.trainerAbout = dto.getTrainerAbout();
        this.trainerImage = dto.getTrainerImage();
    }
}
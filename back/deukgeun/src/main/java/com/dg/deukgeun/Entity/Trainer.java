package com.dg.deukgeun.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trainers")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trainer {
    @Id
    private int trainerId;

    @OneToOne
    @JoinColumn(name = "trainerId", referencedColumnName = "userId")
    private User user;

    private String trainerCareer;
    private String trainerAbout;
    private String trainerImage;
    @ManyToOne
    @JoinColumn(name = "gymId")
    private Gym gym;

}
package com.dg.deukgeun.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "personal_training")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalTraining {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ptId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    private int ptCountTotal;
    private int ptCountRemain;
    private String ptContent;
    private String userPtReason;
    private Integer membershipId;
}

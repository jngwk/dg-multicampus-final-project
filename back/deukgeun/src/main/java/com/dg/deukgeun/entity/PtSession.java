package com.dg.deukgeun.entity;

import jakarta.persistence.CascadeType;
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
@Table(name = "pt_session")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PtSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ptSessionId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pt_id")
    private PersonalTraining pt;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;
    private String memo;
}
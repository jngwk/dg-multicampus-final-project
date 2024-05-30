package com.dg.deukgeun.domain;

import java.sql.Time;

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
@Table(name="pt_session")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PtSession{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ptSessionId;
    private Integer pt_id;
    private Integer trainer_id;
    private Time startTime;
    private Time endTime;
}
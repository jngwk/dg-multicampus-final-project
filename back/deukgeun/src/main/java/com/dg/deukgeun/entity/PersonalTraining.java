package com.dg.deukgeun.entity;

import java.sql.Date;

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
@Table(name="personal_training")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalTraining {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ptId;
    private Integer userId;
    private Integer trainerId;
    private Date regDate;
    private Date expDate;
    private int ptCountTotal;
    private int ptCountRemain;
    private String ptContent;
    private String userPtReason;
    private Integer userGender;
    private Integer userAge;
    private String userWorkoutDur;
}

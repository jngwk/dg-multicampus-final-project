package com.dg.deukgeun.entity;
<<<<<<<< HEAD:back/deukgeun/src/main/java/com/dg/deukgeun/Entity/GymImage.java
// written by Gachudon
========

import java.sql.Time;
>>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12:back/deukgeun/src/main/java/com/dg/deukgeun/Entity/PtSession.java

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
@Table(name = "gym_image")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GymImage {
    @Id
    private String gymImage;
    private Integer gymId;
}

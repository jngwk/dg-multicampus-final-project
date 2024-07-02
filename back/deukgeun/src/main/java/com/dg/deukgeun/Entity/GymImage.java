package com.dg.deukgeun.entity;
// written by Gachudon

import jakarta.persistence.Entity;
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

package com.dg.deukgeun.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user_image")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserImage {
    @Id
    private String userImage;
    private Integer userId;
}
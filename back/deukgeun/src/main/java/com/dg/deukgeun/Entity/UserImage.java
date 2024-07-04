package com.dg.deukgeun.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserImage {
    @Id
    private Integer userId;
    private String userImage;

    public UserImage(Integer userId) {
        this.userId = userId;
    }
}
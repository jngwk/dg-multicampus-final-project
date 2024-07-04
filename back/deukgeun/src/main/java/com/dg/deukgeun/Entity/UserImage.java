package com.dg.deukgeun.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserImage {
    @Id
    private Integer userId;
    private String userImage;

    // @OneToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "user_id", referencedColumnName = "userId", insertable =
    // false, updatable = false)
    // private User user;

    public UserImage(Integer userId) {
        this.userId = userId;
    }
}
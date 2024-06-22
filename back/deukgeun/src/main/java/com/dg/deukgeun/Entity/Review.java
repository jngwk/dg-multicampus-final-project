package com.dg.deukgeun.entity;

import jakarta.persistence.Column;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
<<<<<<< HEAD
@Table(name = "reviews")
=======
@Table(name = "review")
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
<<<<<<< HEAD
    private Integer id;

    @Column(name = "gym_id", nullable = false)
    private Integer gymId;

    private Integer userId;

    private String userName;
    
    private String email;

    @Column(nullable = false)
    private Integer rating;
=======
    private int id;

    @ManyToOne
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int rating;
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

<<<<<<< HEAD
}
=======
    // Getters and Setters
}
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

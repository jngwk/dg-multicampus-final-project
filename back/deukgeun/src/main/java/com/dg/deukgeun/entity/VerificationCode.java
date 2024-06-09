package com.dg.deukgeun.entity;

import java.util.Date;

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
@Table(name = "verification_code")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    // @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    // @JoinColumn(nullable = false, name = "user_id")
    // private User user;

    private String email;

    private Date expiryDate;

}

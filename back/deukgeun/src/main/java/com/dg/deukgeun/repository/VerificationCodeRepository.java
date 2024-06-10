package com.dg.deukgeun.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.dg.deukgeun.entity.VerificationCode;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    VerificationCode findByCode(String code);

    VerificationCode findByEmail(String email);

    VerificationCode findByEmailAndCode(String email, String code);

    @Modifying
    void deleteInBulkByEmail(String email);

    @Modifying
    void deleteInBulkByExpiryDateBefore(Date expiryDate);
}

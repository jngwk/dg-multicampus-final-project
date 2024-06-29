package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dg.deukgeun.entity.PaymentEntity;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
}

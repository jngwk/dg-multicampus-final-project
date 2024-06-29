package com.dg.deukgeun.service;

import org.springframework.stereotype.Service;

import com.dg.deukgeun.entity.PaymentEntity;
import com.dg.deukgeun.repository.PaymentRepository;
import com.siot.IamportRestClient.response.Payment;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public void savePayment(Payment payment) {
        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setImpUid(payment.getImpUid());
        paymentEntity.setMerchantUid(payment.getMerchantUid());
        paymentEntity.setPaidAmount(payment.getAmount().intValue());
        paymentEntity.setApplyNum(payment.getApplyNum());
        // 필요한 추가 정보를 여기에 포함

        paymentRepository.save(paymentEntity);
    }
}

package com.dg.deukgeun.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.service.PaymentService;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {
    @Value("${iamport.key}")
    private String restApiKey;
    @Value("${iamport.secret}")
    private String restApiSecret;

    private final IamportClient iamportClient;
    private final PaymentService paymentService;

    @PreAuthorize("(hasRole('ROLE_GENERAL'))")
    @ResponseBody
    @PostMapping("/verify/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable String imp_uid)
            throws IamportResponseException, IOException {
        IamportResponse<Payment> response = iamportClient.paymentByImpUid(imp_uid);
        if (response.getResponse() != null && "paid".equals(response.getResponse().getStatus())) {
            paymentService.savePayment(response.getResponse());
        }
        return response;
    }
}

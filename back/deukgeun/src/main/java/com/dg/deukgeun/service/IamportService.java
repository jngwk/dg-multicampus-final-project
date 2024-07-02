package com.dg.deukgeun.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

@Service
public class IamportService {
    
    private final IamportClient iamportClient;
    private String apiKey;
    private String apiSecret;

    public IamportService(@Value("${iamport.key}") String apiKey, @Value("${iamport.secret}") String apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.iamportClient = new IamportClient(apiKey, apiSecret);
    }

    @PreAuthorize("(hasRole('ROLE_GENERAL'))")
    public IamportResponse<Payment> verifyPayment(String impUid) throws Exception {
        return iamportClient.paymentByImpUid(impUid);
    }
}
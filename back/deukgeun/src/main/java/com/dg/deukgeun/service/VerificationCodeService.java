package com.dg.deukgeun.service;

import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dg.deukgeun.entity.VerificationCode;
import com.dg.deukgeun.repository.VerificationCodeRepository;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class VerificationCodeService {
    @Autowired
    private VerificationCodeRepository codeRepository;

    public VerificationCode createVerificationCode(String email) {
        Random codeGenerator = new Random();
        codeGenerator.setSeed(System.currentTimeMillis());
        String code = String.valueOf(codeGenerator.nextInt(1000000) % 1000000);

        VerificationCode newCode = new VerificationCode();
        newCode.setCode(code);
        newCode.setEmail(email);
        newCode.setExpiryDate(new Date(System.currentTimeMillis() + 180000)); // 3분
        return codeRepository.save(newCode);
    }

    public VerificationCode getVerificationCode(String email, String code) {
        return codeRepository.findByEmailAndCode(email, code);
    }

    @Transactional
    public void deleteVerificationCode(VerificationCode code) {
        codeRepository.delete(code);
    }

    @Transactional
    public void deleteUnusedCode(String email) {
        codeRepository.deleteInBulkByEmail(email);
    }

    @Transactional
    @Scheduled(fixedRate = 60000) // Run every minute
    public void deleteExpiredCodes() {
        log.info("Expired codes deleted");
        codeRepository.deleteInBulkByExpiryDateBefore(new Date());
    }
}

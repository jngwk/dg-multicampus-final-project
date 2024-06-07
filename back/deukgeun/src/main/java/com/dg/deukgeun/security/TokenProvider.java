package com.dg.deukgeun.security;

import org.springframework.stereotype.Service;
import com.nimbusds.jose.*;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;

import java.time.Instant;
import java.util.Date;

@Service
public class TokenProvider {
    private static final String SECURITY_KEY = "inputYourSecurityKey"; // 보안 키

    // JWT 생성 메서드
    public String createJwt(String email, int duration) {
        try {
            // 현재 시간과 만료 시간 설정
            Instant now = Instant.now(); // 현재 시간
            Instant exprTime = now.plusSeconds(duration); // 만료 시간 (현재 시간 + duration 초)

            // JWT 클레임(Claims) 설정
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(email) // sub: 이메일 (토큰의 주제)
                    .issueTime(Date.from(now)) // iat: 발행 시간
                    .expirationTime(Date.from(exprTime)) // exp: 만료 시간
                    .build();

            // JWT 서명 객체 생성
            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256), // 헤더 설정 
                    claimsSet // 클레임 설정
            );

            // 서명 생성기 설정 
            JWSSigner signer = new MACSigner(SECURITY_KEY.getBytes());
            signedJWT.sign(signer); // JWT 서명

            return signedJWT.serialize(); // JWT 문자열 반환
        } catch (JOSEException e) {
            return null; // 예외 발생 시 null 반환
        }
    }

    // JWT 검증 메서드
    public String validateJwt(String token) {
        try {
            // JWT 파싱 및 서명 검증
            SignedJWT signedJWT = SignedJWT.parse(token); // JWT 파싱
            JWSVerifier verifier = new MACVerifier(SECURITY_KEY.getBytes()); // 서명 검증기 설정 
            if (signedJWT.verify(verifier)) {
                return signedJWT.getJWTClaimsSet().getSubject(); // 서명 검증 성공 시 토큰의 주제(subject) 반환
            } else {
                // 서명이 유효하지 않은 경우
                return null; // 서명 검증 실패 시 null 반환
            }
        } catch (Exception e) {
            return null; // 예외 발생 시 null 반환
        }
    }
}
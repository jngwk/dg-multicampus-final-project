package com.dg.deukgeun.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.nimbusds.jose.*;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    // JWT 토큰 생성 메서드
    public String createToken(String email, String role, int duration) {
        try {
            Instant now = Instant.now();
            Instant expiryTime = now.plusSeconds(duration);

            // JWT 클레임 설정
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(email)
                    .claim("role", role)
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(expiryTime))
                    .build();

            // JWT 서명
            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            JWSSigner signer = new MACSigner(secretKey.getBytes());
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            logger.error("JWT 토큰 생성 중 오류 발생", e);
            throw new RuntimeException("JWT 토큰 생성 중 오류 발생", e);
        }
    }

    // JWT 토큰 검증 메서드
    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secretKey.getBytes());

            return signedJWT.verify(verifier) && new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());
        } catch (Exception e) {
            logger.error("JWT 토큰 검증 중 오류 발생", e);
            return false;
        }
    }

    // 토큰에서 이메일 추출 메서드
    public String getEmailFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            logger.error("JWT 토큰에서 이메일 추출 중 오류 발생", e);
            return null;
        }
    }

    // 토큰에서 역할 추출 메서드
    public String getRoleFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getStringClaim("role");
        } catch (Exception e) {
            logger.error("JWT 토큰에서 역할 추출 중 오류 발생", e);
            return null;
        }
    }
}

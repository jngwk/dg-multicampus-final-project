package com.dg.deukgeun.security;

import java.time.Instant;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.entity.Gym;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

@Component
public class JwtTokenProvider {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    /**
     * JWT 토큰을 생성하는 메서드
     * 
     * @param email    사용자 이메일
     * @param role     사용자 역할
     * @param duration 토큰 유효 기간(초)
     * @return 생성된 JWT 토큰
     */
    public String createToken(Integer userId, String email, UserRole role, String userName, int duration) {
        try {
            Instant now = Instant.now();
            Instant expiryTime = now.plusSeconds(duration);

            // JWT 클레임 설정
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(userId.toString())
                    .claim("email", email)
                    .claim("role", role.name())
                    .claim("userName", userName)
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(expiryTime))
                    .build();

            // JWT 서명
            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            JWSSigner signer = new MACSigner(secretKey.getBytes());
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            System.out.println("JWT 토큰 생성 중 오류 발생: " + e.getMessage());
            throw new RuntimeException("JWT 토큰 생성 중 오류 발생", e);
        }
    }

    /**
     * Gym 정보를 포함하여 JWT 토큰을 생성하는 메서드
     * 
     * @param email    사용자 이메일
     * @param role     사용자 역할
     * @param gym      Gym 정보
     * @param duration 토큰 유효 기간(초)
     * @return 생성된 JWT 토큰
     */
    public String createTokenWithGymInfo(String email, UserRole role, Gym gym, int duration) {
        try {
            Instant now = Instant.now();
            Instant expiryTime = now.plusSeconds(duration);

            JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                    .subject(email)
                    .claim("role", role.name())
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(expiryTime));

            if (gym != null) {
                claimsBuilder.claim("gymId", gym.getGymId());
                claimsBuilder.claim("gymName", gym.getGymName());
                // 필요한 다른 gym 세부 정보를 추가
            }

            JWTClaimsSet claimsSet = claimsBuilder.build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            JWSSigner signer = new MACSigner(secretKey.getBytes());
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            System.out.println("JWT 토큰 생성 중 오류 발생: " + e.getMessage());
            throw new RuntimeException("JWT 토큰 생성 중 오류 발생", e);
        }
    }

    /**
     * JWT 토큰을 검증하는 메서드
     * 
     * @param token 검증할 JWT 토큰
     * @return 토큰이 유효한지 여부
     */
    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secretKey.getBytes());

            return signedJWT.verify(verifier) && new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());
        } catch (Exception e) {
            System.out.println("JWT 토큰 검증 중 오류 발생: " + e.getMessage());
            return false;
        }
    }

        /**
     * JWT 토큰에서 역할을 추출하는 메서드
     * 
     * @param token JWT 토큰
     * @return 추출된 역할
     */
    public Integer getUserIdFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return Integer.parseInt(signedJWT.getJWTClaimsSet().getSubject());
        } catch (Exception e) {
            System.out.println("JWT 토큰에서 유저Id 추출 중 오류 발생: " + e.getMessage());
            return null;
        }
    }

    /**
     * JWT 토큰에서 이메일을 추출하는 메서드
     * 
     * @param token JWT 토큰
     * @return 추출된 이메일
     */
    public String getEmailFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getStringClaim("email");
        } catch (Exception e) {
            System.out.println("JWT 토큰에서 이메일 추출 중 오류 발생: " + e.getMessage());
            return null;
        }
    }

    /**
     * JWT 토큰에서 역할을 추출하는 메서드
     * 
     * @param token JWT 토큰
     * @return 추출된 역할
     */
    public UserRole getRoleFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String role = signedJWT.getJWTClaimsSet().getStringClaim("role");
            return UserRole.valueOf(role);
        } catch (Exception e) {
            System.out.println("JWT 토큰에서 역할 추출 중 오류 발생: " + e.getMessage());
            return null;
        }
    }

    /**
     * JWT 토큰에서 userName을 추출하는 메서드
     * 
     * @param token JWT 토큰
     * @return 추출된 이름
     */
    public String getUserNameFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getStringClaim("userName");
        } catch (Exception e) {
            System.out.println("JWT 토큰에서 유저이름 추출 중 오류 발생: " + e.getMessage());
            return null;
        }
    }
}

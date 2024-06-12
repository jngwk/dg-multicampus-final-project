package com.dg.deukgeun.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.JwtTokenProvider;

@Service
public class GymService {

    @Autowired GymRepository gymRepository;
    @Autowired UserRepository userRepository;
    @Autowired JwtTokenProvider tokenProvider;

    // 회원 가입 서비스 메서드
    public ResponseDTO<?> signUp(GymSignUpDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        // 이메일 중복 확인
        try {
            if (userRepository.existsByEmail(email)) {
                return ResponseDTO.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            System.out.println("데이터베이스 연결에 실패하였습니다. " + e.getMessage());
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // 비밀번호 확인
        if (!password.equals(dto.getPassword())) {
            return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
        }

        // User 엔티티 생성
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        user.setDetailAddress(dto.getDetailAddress());
        user.setRole(UserRole.ROLE_GYM); // 역할 설정

        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);

        // User 엔티티를 데이터베이스에 저장
        try {
            userRepository.save(user);
        } catch (Exception e) {
            System.out.println("데이터베이스 연결에 실패하였습니다. " + e.getMessage());
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // Gym 엔티티 생성
        Gym gym = new Gym();
        gym.setUser(user);
        gym.setGymName(dto.getGymName());
        gym.setCrNumber(dto.getCrNumber());
        gym.setPhoneNumber(dto.getPhoneNumber());
        gym.setAddress(dto.getAddress());
        gym.setDetailAddress(dto.getDetailAddress());
        gym.setOperatingHours(dto.getOperatingHours());
        gym.setPrices(dto.getPrices());
        gym.setIntroduce(dto.getIntroduce());

        // Gym 엔티티를 데이터베이스에 저장
        try {
            gymRepository.save(gym);
        } catch (Exception e) {
            System.out.println("데이터베이스 연결에 실패하였습니다. " + e.getMessage());
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // 사용자 정보 응답 DTO 생성
        return ResponseDTO.setSuccess("Gym 회원 생성에 성공했습니다.");
    }
}

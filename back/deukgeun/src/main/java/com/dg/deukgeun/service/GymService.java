package com.dg.deukgeun.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.Gym;
import com.dg.deukgeun.Entity.User;
import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.LoginResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.TokenProvider;

@Service
public class GymService {

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    public ResponseDTO<?> signUp(GymSignUpDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        // 이메일 중복 확인
        try {
            if (userRepository.existsByEmail(email)) {
                return ResponseDTO.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // 비밀번호 중복 확인
        if (!password.equals(dto.getPassword())) {
            return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
        }

        // User 엔티티 생성
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        user.setDetailAddress(dto.getDetailAddress());
        user.setCategory(dto.getCategory());
        user.setApproval(dto.getApproval());

        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);

        // User 엔티티를 데이터베이스에 저장
        try {
            userRepository.save(user);
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // Gym 엔티티 생성
        Gym gym = new Gym();
        gym.setUserId(user.getUserId());
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
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // 새로운 헬스장 사용자에 대한 토큰 생성
        String token;
        try {
            token = tokenProvider.createJwt(email, 3600); // 1시간 지속 시간
        } catch (Exception e) {
            return ResponseDTO.setFailed("토큰 생성에 실패하였습니다.");
        }

        // 토큰과 사용자 정보를 포함하는 응답 DTO 생성
        return ResponseDTO.setSuccessData("Gym 회원 생성에 성공했습니다.", token);
    }

    public ResponseDTO<LoginResponseDTO> login(LoginDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        User user;

        try {
            // 이메일로 사용자 정보 가져오기
            user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseDTO.setFailed("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
            }

            // 사용자가 입력한 비밀번호를 BCryptPasswordEncoder를 사용하여 암호화
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = user.getPassword();

            // 저장된 암호화된 비밀번호와 입력된 비밀번호 비교
            if (!passwordEncoder.matches(password, encodedPassword)) {
                return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // 클라이언트에 비밀번호 제공 방지
        user.setPassword("");

        int exprTime = 3600; // 1시간
        String token;

        try {
            token = tokenProvider.createJwt(email, exprTime);
        } catch (Exception e) {
            return ResponseDTO.setFailed("토큰 생성에 실패하였습니다.");
        }

        LoginResponseDTO loginResponseDto = new LoginResponseDTO(token, exprTime, user);

        return ResponseDTO.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
    }
}

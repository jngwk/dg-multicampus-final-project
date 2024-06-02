package com.dg.deukgeun.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.User;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.LoginResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.SignUpDTO;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.TokenProvider;

@Service
public class UserService {

    @Autowired UserRepository userRepository;
    @Autowired TokenProvider tokenProvider;

    public ResponseDTO<?> signUp(SignUpDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        // String confirmPassword = dto.getConfirmPassword();

        // email 중복 확인
        try {
            // 존재하는 경우 : true / 존재하지 않는 경우 : false
            if (userRepository.existsByEmail(email)) {
                return ResponseDTO.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // password 중복 확인
        if (!password.equals(dto.getPassword())) {
            return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
        }


        // UserEntity 생성
        User user = new User(dto);

        // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);

        // UserRepository를 이용하여 DB에 Entity 저장
        try {
            userRepository.save(user);
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return ResponseDTO.setSuccess("회원 생성에 성공했습니다.");
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

        // Client에 비밀번호 제공 방지
        user.setPassword("");
 
        int exprTime = 3600; // 1h
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

package com.dg.deukgeun.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.UserEntity;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.LoginResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.SignUpDTO;
import com.dg.deukgeun.repository.UserRepository;

@Service
public class UserService {

    @Autowired UserRepository userRepository;

    public ResponseDTO<?> signUp(SignUpDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        // String confirmPassword = dto.getConfirmPassword();

        // email 중복 확인
        try {
            // 존재하는 경우 : true / 존재하지 않는 경우 : false
            if(userRepository.existsByEmail(email)) {
                return ResponseDTO.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // password 중복 확인
        if(!password.equals(dto.getPassword())) {
            return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
        }

        // UserEntity 생성
        UserEntity userEntity = new UserEntity(dto);

        // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
        try {
            userRepository.save(userEntity);
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return ResponseDTO.setSuccess("회원 생성에 성공했습니다.");
    }



    public ResponseDTO<LoginResponseDTO> login(LoginDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        try {
            // 사용자 email/password 일치하는지 확인
            boolean existed = userRepository.existsByEmailAndPassword(email, password);
            if(!existed) {
                return ResponseDTO.setFailed("입력하신 로그인 정보가 존재하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        UserEntity userEntity = null;

        try {
            // 값이 존재하는 경우 사용자 정보 불러옴 (기준 email)
            userEntity = userRepository.findByEmail(email).get();
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        userEntity.setPassword("");

        int exprTime = 3600000;     // 1h

        LoginResponseDTO loginResponseDto = new LoginResponseDTO(exprTime, userEntity);

        return ResponseDTO.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
    }
}

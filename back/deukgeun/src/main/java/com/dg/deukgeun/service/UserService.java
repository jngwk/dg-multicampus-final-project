package com.dg.deukgeun.service;

import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.LoginResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.dto.user.UserSignUpDTO;
import com.dg.deukgeun.dto.user.UserWithTrainerDTO;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.TokenProvider;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    TokenProvider tokenProvider;

    @Autowired
    TrainerRepository trainerRepository;

    public ResponseDTO<?> signUp(UserSignUpDTO dto) {
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

    public ResponseDTO<UserWithTrainerDTO> getUserInfo(String email) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User userEntity = userOptional.get();
                // 사용자 비밀번호 필드를 빈 문자열로 설정하여 보안성을 유지
                userEntity.setPassword("");

                // 사용자가 트레이너인 경우
                if ("trainer".equals(userEntity.getCategory())) {
                    Optional<Trainer> trainerOptional = trainerRepository.findByUser_UserId(userEntity.getUserId());
                    if (trainerOptional.isPresent()) {
                        Trainer trainerEntity = trainerOptional.get();
                        // 사용자와 트레이너 정보를 모두 포함하는 DTO 생성
                        UserWithTrainerDTO userWithTrainerDTO = new UserWithTrainerDTO(userEntity, trainerEntity);
                        return ResponseDTO.setSuccessData("사용자 정보를 조회했습니다.", userWithTrainerDTO);
                    } else {
                        return ResponseDTO.setFailed("해당 이메일로 가입된 트레이너를 찾을 수 없습니다.");
                    }
                }

                // 사용자가 일반 사용자인 경우
                return ResponseDTO.setSuccessData("사용자 정보를 조회했습니다.", new UserWithTrainerDTO(userEntity, null));
            } else {
                return ResponseDTO.setFailed("해당 이메일로 가입된 사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
    }

    public ResponseDTO<?> updateUser(UpdateUserDTO dto) {
        String email = dto.getEmail();

        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Update the user information
                user.setUserName(dto.getUserName());
                user.setEmail(dto.getEmail());
                user.setAddress(dto.getAddress());

                // Save the updated user entity
                userRepository.save(user);

                // If user is a trainer, update trainer information as well
                if ("trainer".equals(user.getCategory())) {
                    Optional<Trainer> trainerOptional = trainerRepository.findByUser_UserId(user.getUserId());
                    if (trainerOptional.isPresent()) {
                        Trainer trainer = trainerOptional.get();
                        trainer.setTrainerCareer(dto.getTrainerCareer());
                        trainer.setTrainerAbout(dto.getTrainerAbout());
                        trainer.setTrainerImage(dto.getTrainerImage());
                        trainerRepository.save(trainer);
                    } else {
                        return ResponseDTO.setFailed("해당 사용자의 트레이너 정보를 찾을 수 없습니다.");
                    }
                }

                return ResponseDTO.setSuccess("사용자 정보가 성공적으로 업데이트되었습니다.");
            } else {
                return ResponseDTO.setFailed("해당 이메일로 가입된 사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
    }
}
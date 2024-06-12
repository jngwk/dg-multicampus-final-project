package com.dg.deukgeun.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.dto.gym.GymLoginResponseDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.LoginResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.dto.user.UserSignUpDTO;
import com.dg.deukgeun.dto.user.UserWithTrainerDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.JwtTokenProvider;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtTokenProvider tokenProvider;
    @Autowired
    GymRepository gymRepository;
    @Autowired
    TrainerRepository trainerRepository;

    public ResponseDTO<?> signUp(UserSignUpDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        try {
            if (userRepository.existsByEmail(email)) {
                return ResponseDTO.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        if (!password.equals(dto.getPassword())) {
            return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
        }

        // UserEntity 생성
        User user = new User(dto);
        user.setRole(UserRole.ROLE_GENERAL);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);

        try {
            userRepository.save(user);
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return ResponseDTO.setSuccess("회원 생성에 성공했습니다.");
    }

    public ResponseDTO<?> login(LoginDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        User user;
        try {
            user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseDTO.setFailed("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = user.getPassword();

            if (!passwordEncoder.matches(password, encodedPassword)) {
                return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        user.setPassword("");

        int exprTime = 3600; // 1h
        String token;

        try {
            token = tokenProvider.createToken(user.getUserId(), email, user.getRole(),  user.getUserName(), exprTime);
            if (token == null || token.isEmpty()) {
                throw new Exception("토큰 생성에 실패하였습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("토큰 생성에 실패하였습니다.");
        }

        if (user.getRole() == UserRole.ROLE_GYM) {
            Gym gym = gymRepository.findByUser(user).orElse(null);
            GymLoginResponseDTO gymLoginResponseDto = new GymLoginResponseDTO(token, exprTime, user, gym);
            return ResponseDTO.setSuccessData("로그인에 성공하였습니다.", gymLoginResponseDto);
        } else {
            LoginResponseDTO loginResponseDto = new LoginResponseDTO(token, exprTime, user);
            return ResponseDTO.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
        }
    }

    public ResponseDTO<UserWithTrainerDTO> getUserInfo(String email) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            
            if (userOptional.isPresent()) {
                User userEntity = userOptional.get();
                // 사용자 비밀번호 필드를 빈 문자열로 설정하여 보안성을 유지
                userEntity.setPassword("");

                // 사용자가 트레이너인 경우
                if (UserRole.ROLE_TRAINER.equals(userEntity.getRole())) {
                    Optional<Trainer> trainerOptional = trainerRepository.findByUser_UserId(userEntity.getUserId());
                    if (trainerOptional.isPresent()) {
                        Trainer trainerEntity = trainerOptional.get();
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
                user.setDetailAddress(dto.getDetailAddress());

                // Save the updated user entity
                userRepository.save(user);

                // If user is a trainer, update trainer information as well
                if ("TRAINER".equals(user.getRole())) {
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

    public ResponseDTO<List<User>> getAllUsers(String adminEmail) {
        try {
            // Check if the adminEmail belongs to an ADMIN user
            Optional<User> adminOptional = userRepository.findByEmail(adminEmail);
            if (adminOptional.isPresent() && "ADMIN".equals(adminOptional.get().getRole())) {
                // Fetch all users with role USER
                List<User> users = userRepository.findByRole("USER");
                // For security reasons, set the password field to an empty string
                for (User user : users) {
                    user.setPassword("");
                }
                return ResponseDTO.setSuccessData("모든 사용자 목록을 가져왔습니다.", users);
            } else {
                return ResponseDTO.setFailed("권한이 없습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
    }
}

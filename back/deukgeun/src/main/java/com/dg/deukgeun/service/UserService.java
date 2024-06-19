package com.dg.deukgeun.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.dto.gym.GymLoginResponseDTO;
import com.dg.deukgeun.dto.gym.TrainerDTO;
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
    @Autowired
    EmailService emailService;
    // @Autowired
    // BCryptPasswordEncoder passwordEncoder;

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

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')")
    public ResponseDTO<?> signUp(TrainerDTO trainerDTO, Integer userId) {
        String email = trainerDTO.getEmail();
        String password = trainerDTO.getPassword();


        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            return ResponseDTO.setFailed("중복된 Email 입니다.");
        }

        // Hash the password
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        // Create User entity
        User user = new User();
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setUserName(trainerDTO.getUserName());
        user.setAddress(trainerDTO.getAddress());
        user.setDetailAddress(trainerDTO.getDetailAddress());
        user.setRole(UserRole.ROLE_TRAINER);

        // Save User entity
        try {
            userRepository.save(user);
        } catch (Exception e) {
            return ResponseDTO.setFailed("사용자 정보를 저장하는 도중 오류가 발생했습니다.");
        }
      
        // Find Gym by userId
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseDTO.setFailed("유효하지 않은 User ID 입니다.");
        }
        Optional<Gym> gymOptional = gymRepository.findByUser(userOptional.get());
        if (gymOptional.isEmpty()) {
            return ResponseDTO.setFailed("해당 사용자에게 연결된 Gym을 찾을 수 없습니다.");
        }
        Gym gym = gymOptional.get();

        // Create Trainer entity
        Trainer trainer = new Trainer();
        trainer.setUser(user);
        trainer.setTrainerCareer(trainerDTO.getTrainerCareer());
        trainer.setTrainerAbout(trainerDTO.getTrainerAbout());
        trainer.setTrainerImage(trainerDTO.getTrainerImage());
        trainer.setGym(gym);

        // Save Trainer entity
        try {
            trainerRepository.save(trainer);
        } catch (Exception e) {
            return ResponseDTO.setFailed("트레이너 정보를 저장하는 도중 오류가 발생했습니다.");
        }
        

        return ResponseDTO.setSuccess("트레이너 생성에 성공했습니다.");
    }

    public ResponseEntity<?> login(LoginDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        User user;
        try {
            user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = user.getPassword();

            if (!passwordEncoder.matches(password, encodedPassword)) {
                return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("데이터베이스 연결에 실패하였습니다.");
        }

        user.setPassword("");

        /*
         * 
         * 쿠키 유효기간
         * 
         */
        int exprTime = 24 * 3600; // 1h
        String token;

        try {
            token = tokenProvider.createToken(user.getUserId(), email, user.getRole(), user.getUserName(), exprTime);
            if (token == null || token.isEmpty()) {
                throw new Exception("토큰 생성에 실패하였습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("토큰 생성에 실패하였습니다.");
        }

        // 쿠키 생성
        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(exprTime)
                .sameSite("Strict")
                .build();

        // TODO gym 회원 토큰 관련 수정
        if (user.getRole() == UserRole.ROLE_GYM) {
            Gym gym = gymRepository.findByUser(user).orElse(null);
            GymLoginResponseDTO gymLoginResponseDto = new GymLoginResponseDTO(token, exprTime, user, gym);
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginResponseDTO(token));
        } else {
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginResponseDTO(token));
        }
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')")
    public ResponseDTO<UserWithTrainerDTO> getUserInfo(Integer userId) {
        try {
            Optional<User> userOptional = userRepository.findByUserId(userId);

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

    // public ResponseDTO<UserWithTrainerDTO> getUserInfo(String email) {
    // try {
    // Optional<User> userOptional = userRepository.findByEmail(email);

    // if (userOptional.isPresent()) {
    // User userEntity = userOptional.get();
    // // 사용자 비밀번호 필드를 빈 문자열로 설정하여 보안성을 유지
    // userEntity.setPassword("");

    // // 사용자가 트레이너인 경우
    // if (UserRole.ROLE_TRAINER.equals(userEntity.getRole())) {
    // Optional<Trainer> trainerOptional =
    // trainerRepository.findByUser_UserId(userEntity.getUserId());
    // if (trainerOptional.isPresent()) {
    // Trainer trainerEntity = trainerOptional.get();
    // UserWithTrainerDTO userWithTrainerDTO = new UserWithTrainerDTO(userEntity,
    // trainerEntity);
    // return ResponseDTO.setSuccessData("사용자 정보를 조회했습니다.", userWithTrainerDTO);
    // } else {
    // return ResponseDTO.setFailed("해당 이메일로 가입된 트레이너를 찾을 수 없습니다.");
    // }
    // }

    // // 사용자가 일반 사용자인 경우
    // return ResponseDTO.setSuccessData("사용자 정보를 조회했습니다.", new
    // UserWithTrainerDTO(userEntity, null));
    // } else {
    // return ResponseDTO.setFailed("해당 이메일로 가입된 사용자를 찾을 수 없습니다.");
    // }
    // } catch (Exception e) {
    // return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
    // }
    // }

    public ResponseDTO<?> updateUser(UpdateUserDTO dto) {
        Integer userId = dto.getUserId();

        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findById(userId);
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
                if ("ROLE_TRAINER".equals(user.getRole())) {
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

    public ResponseDTO<List<User>> getAllUsers(Integer adminId) {
        try {
            // Check if the adminEmail belongs to an ADMIN user
            Optional<User> adminOptional = userRepository.findById(adminId);
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

    // public ResponseDTO<?> requestPasswordReset(String email) {
    //     try {
    //         User user = userRepository.findByEmail(email).orElse(null);
    //         if (user == null) {
    //             return ResponseDTO.setFailed("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
    //         }

    //         // Generate reset token
    //         String resetToken = tokenProvider.createToken(user.getUserId(), email, user.getRole(), user.getUserName(), 3600); // 1 hour expiry
    //         emailService.sendResetPasswordEmail(email, resetToken);

    //         return ResponseDTO.setSuccess("비밀번호 재설정 이메일이 발송되었습니다.");
    //     } catch (Exception e) {
    //         return ResponseDTO.setFailed("비밀번호 재설정 요청 처리 중 오류가 발생하였습니다.");
    //     }
    // }

    // public ResponseDTO<?> resetPassword(String token, String newPassword) {
    //     try {
    //         if (tokenProvider.validateToken(token)) {
    //             Integer userId = tokenProvider.getUserIdFromToken(token);
    //             User user = userRepository.findByUserId(userId).orElse(null);

    //             if (user == null) {
    //                 return ResponseDTO.setFailed("유효하지 않은 토큰입니다.");
    //             }

    //             String hashedPassword = passwordEncoder.encode(newPassword);
    //             user.setPassword(hashedPassword);
    //             userRepository.save(user);

    //             return ResponseDTO.setSuccess("비밀번호가 성공적으로 변경되었습니다.");
    //         } else {
    //             return ResponseDTO.setFailed("유효하지 않은 토큰입니다.");
    //         }
    //     } catch (Exception e) {
    //         return ResponseDTO.setFailed("비밀번호 재설정 처리 중 오류가 발생하였습니다.");
    //     }
    // }
    
}

package com.dg.deukgeun.service;

<<<<<<< HEAD
import java.util.List;
import java.util.Optional;

=======
import java.util.*;
import java.util.stream.Collectors;
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
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
=======
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.LoginResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
// import com.dg.deukgeun.dto.user.SignUpDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.repository.UserRepository;
// import com.dg.deukgeun.security.TokenProvider;
import com.dg.deukgeun.dto.user.UserWithTrainerDTO;
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

@Service
public class UserService {

<<<<<<< HEAD
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
=======
    @Autowired UserRepository userRepository;
    // @Autowired TokenProvider tokenProvider;

    @Autowired
    TrainerRepository trainerRepository;

    // public ResponseDTO<?> signUp(SignUpDTO dto) {
    //     String email = dto.getEmail();
    //     String password = dto.getPassword();
    //     // String confirmPassword = dto.getConfirmPassword();

    //     // email 중복 확인
    //     try {
    //         // 존재하는 경우 : true / 존재하지 않는 경우 : false
    //         if (userRepository.existsByEmail(email)) {
    //             return ResponseDTO.setFailed("중복된 Email 입니다.");
    //         }
    //     } catch (Exception e) {
    //         return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
    //     }

    //     // password 중복 확인
    //     if (!password.equals(dto.getPassword())) {
    //         return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
    //     }


    //     // UserEntity 생성
    //     User user = new User(dto);

    //     // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
    //     // 비밀번호 암호화
    //     BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    //     String hashedPassword = passwordEncoder.encode(password);
    //     user.setPassword(hashedPassword);

    //     // UserRepository를 이용하여 DB에 Entity 저장
    //     try {
    //         userRepository.save(user);
    //     } catch (Exception e) {
    //         return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
    //     }

    //     return ResponseDTO.setSuccess("회원 생성에 성공했습니다.");
    // }

    // public ResponseDTO<LoginResponseDTO> login(LoginDTO dto) {
    //     String email = dto.getEmail();
    //     String password = dto.getPassword();

    //     User user;

    //     try {
    //         // 이메일로 사용자 정보 가져오기
    //         user = userRepository.findByEmail(email).orElse(null);
    //         if (user == null) {
    //             return ResponseDTO.setFailed("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
    //         }

    //         // 사용자가 입력한 비밀번호를 BCryptPasswordEncoder를 사용하여 암호화
    //         BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    //         String encodedPassword = user.getPassword();

    //         // 저장된 암호화된 비밀번호와 입력된 비밀번호 비교
    //         if (!passwordEncoder.matches(password, encodedPassword)) {
    //             return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
    //         }
    //     } catch (Exception e) {
    //         return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
    //     }

    //     // Client에 비밀번호 제공 방지
    //     user.setPassword("");
 
    //     int exprTime = 3600; // 1h
    //     String token;

    //     try {
    //         token = tokenProvider.createJwt(email, exprTime);
    //     } catch (Exception e) {
    //         return ResponseDTO.setFailed("토큰 생성에 실패하였습니다.");
    //     }

    //     LoginResponseDTO loginResponseDto = new LoginResponseDTO(token, exprTime, user);

    //     return ResponseDTO.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
    // }

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
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
<<<<<<< HEAD

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
=======
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
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
            } else {
                return ResponseDTO.setFailed("해당 이메일로 가입된 사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
<<<<<<< HEAD
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
                user.setAddress(dto.getAddress());
                user.setDetailAddress(dto.getDetailAddress());

                String password = dto.getPassword();
                // Hash the password
                if (!password.equals("")) {
                    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                    String hashedPassword = passwordEncoder.encode(password);
                    user.setPassword(hashedPassword);
                }

                // Save the updated user entity
                userRepository.save(user);

                // If user is a trainer, update trainer information as well
                if ("ROLE_TRAINER".equals(user.getRole().toString())) {
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
            if (adminOptional.isPresent() && "ADMIN".equals(adminOptional.get().getRole().toString())) {
                // Fetch all users with role USER
                List<User> users = userRepository.findByRole("USER");
=======
    }

    public ResponseDTO<List<User>> getAllUsers(String adminEmail, String searchQuery) {
        try {
            // Check if the adminEmail belongs to an ADMIN user
            Optional<User> adminOptional = userRepository.findByEmail(adminEmail);
            if (adminOptional.isPresent() && "ADMIN".equals(adminOptional.get().getRole())) {
                // Fetch all users with role USER
                List<User> users = userRepository.findByRole("USER");
                if (searchQuery != null && !searchQuery.isEmpty()) {
                    // 검색 쿼리를 포함하는 이름으로 사용자를 가져옵니다.
                    users = userRepository.findByUserNameContainingIgnoreCase(searchQuery);
                } else {
                    // 역할이 USER인 모든 사용자를 가져옵니다.
                    users = userRepository.findByRole("USER");
                }
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
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

<<<<<<< HEAD
    public Boolean emailDuplicateCheck(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // public ResponseDTO<?> requestPasswordReset(String email) {
    // try {
    // User user = userRepository.findByEmail(email).orElse(null);
    // if (user == null) {
    // return ResponseDTO.setFailed("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
    // }

    // // Generate reset token
    // String resetToken = tokenProvider.createToken(user.getUserId(), email,
    // user.getRole(), user.getUserName(), 3600); // 1 hour expiry
    // emailService.sendResetPasswordEmail(email, resetToken);

    // return ResponseDTO.setSuccess("비밀번호 재설정 이메일이 발송되었습니다.");
    // } catch (Exception e) {
    // return ResponseDTO.setFailed("비밀번호 재설정 요청 처리 중 오류가 발생하였습니다.");
    // }
    // }

    // public ResponseDTO<?> resetPassword(String token, String newPassword) {
    // try {
    // if (tokenProvider.validateToken(token)) {
    // Integer userId = tokenProvider.getUserIdFromToken(token);
    // User user = userRepository.findByUserId(userId).orElse(null);

    // if (user == null) {
    // return ResponseDTO.setFailed("유효하지 않은 토큰입니다.");
    // }

    // String hashedPassword = passwordEncoder.encode(newPassword);
    // user.setPassword(hashedPassword);
    // userRepository.save(user);

    // return ResponseDTO.setSuccess("비밀번호가 성공적으로 변경되었습니다.");
    // } else {
    // return ResponseDTO.setFailed("유효하지 않은 토큰입니다.");
    // }
    // } catch (Exception e) {
    // return ResponseDTO.setFailed("비밀번호 재설정 처리 중 오류가 발생하였습니다.");
    // }
    // }

=======
    
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
}

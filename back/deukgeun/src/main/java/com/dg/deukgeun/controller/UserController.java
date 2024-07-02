package com.dg.deukgeun.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.gym.TrainerDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.dto.user.UserImageDTO;
import com.dg.deukgeun.dto.user.UserSignUpDTO;
import com.dg.deukgeun.entity.VerificationCode;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.EmailService;
import com.dg.deukgeun.service.GymService;
import com.dg.deukgeun.service.TrainerService;
import com.dg.deukgeun.service.UserImageService;
import com.dg.deukgeun.service.UserService;
import com.dg.deukgeun.service.VerificationCodeService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;
    @Autowired
    VerificationCodeService codeService;
    @Autowired
    GymService gymService;

    @Autowired
    TrainerService trainerService;

    @Autowired
    UserImageService userImageService;

    // 인증번호 이메일 전송
    @PostMapping("/sendCode")
    public ResponseEntity<?> sendVerificationCode(@RequestBody VerificationCode codeEntity) {
        try {
            if (!emailService.isValidEmailAddress(codeEntity.getEmail())) {
                return ResponseEntity.badRequest().body("유효하지 않은 이메일입니다.");
            }
            emailService.sendVerificationEmail(codeEntity.getEmail(), codeEntity.getCode());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("이메일이 전송됐습니다. 인증번호: " + codeEntity.getCode());
    }

    // general 회원가입
    @PostMapping("/signUp/general")
    public ResponseDTO<?> signUp(@RequestBody UserSignUpDTO userSignUpDTO) {
        return userService.signUp(userSignUpDTO);
    }

    // GYM 회원가입
    @PostMapping("/signUp/gym")
    public ResponseDTO<?> registerGym(@RequestBody GymSignUpDTO requestBody) {
        return gymService.signUp(requestBody);
    }

    // trainer 회원가입
    @PostMapping("/signUp/trainer")
    public ResponseDTO<?> registerTrainer(@RequestBody TrainerDTO requestBody) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        return trainerService.signUp(requestBody, userId);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }

    @GetMapping("/userInfo")
    public ResponseDTO<?> getUserInfo() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        return userService.getUserInfo(userId);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // Set maxAge to 0 to delete the cookie
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok().build();
    }

    // @GetMapping("/userInfo")
    // public ResponseDTO<?> getUserInfo(HttpServletRequest request) {
    // Integer userId = (Integer) request.getAttribute("userId");
    // return userService.getUserInfo(userId);
    // }

    @PutMapping("/update")
    public ResponseDTO<?> updateUser(@RequestBody UpdateUserDTO updateUserDTO) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        updateUserDTO.setUserId(userDetails.getUserId());
        return userService.updateUser(updateUserDTO);
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER') || hasRole('ROLE_ADMIN')")
    @GetMapping("/token")
    public ResponseEntity<String> getToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return ResponseEntity.ok(cookie.getValue());
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token not found");
    }

    @PostMapping("/emailCheck/duplicate")
    public Boolean emailDuplicateCheck(@RequestBody User requestBody) {
        return userService.emailDuplicateCheck(requestBody.getEmail());
    }

    // @PostMapping("/reqPwReset")
    // public ResponseEntity<ResponseDTO<?>> requestPasswordReset(@RequestBody
    // Map<String, String> request) {
    // String email = request.get("email");
    // return ResponseEntity.ok(userService.requestPasswordReset(email));
    // }

    // @PostMapping("/resetPw")
    // public ResponseEntity<ResponseDTO<?>> resetPassword(@RequestBody Map<String,
    // String> request) {
    // String token = request.get("token");
    // String newPassword = request.get("newPassword");
    // return ResponseEntity.ok(userService.resetPassword(token, newPassword));
    // }

    // 새로운 이미지를 저장하기 위한 컨트롤러 메서드 추가
    @PostMapping("/uploadImage")
    public ResponseEntity<ResponseDTO<Void>> uploadUserImages(@RequestParam("imageFiles") List<MultipartFile> imageFiles) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        try {
            for (MultipartFile file : imageFiles) {
                userImageService.insert(file, userId);
            }
            return ResponseEntity.ok().body(ResponseDTO.setSuccess("Images uploaded successfully"));
        } catch (Exception e) {
            log.error("Failed to upload images for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.setFailed("Failed to upload images."));
        }
    }

    // 사용자 ID에 따라 사용자 이미지를 가져오는 엔드포인트
    @GetMapping("/getImage")
    public ResponseEntity<ResponseDTO<UserImageDTO>> getUserImages() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        try {
            UserImageDTO userImages = userImageService.getByUserId(userId);
            if (userImages != null) {
                return ResponseEntity.ok()
                        .body(ResponseDTO.setSuccessData("User images retrieved successfully", userImages));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Failed to retrieve user images for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.setFailed("Failed to retrieve user images."));
        }
    }

    // 사용자 ID에 따라 사용자 이미지를 업데이트하는 엔드포인트
    @PutMapping("/updateImage")
    public ResponseEntity<ResponseDTO<Void>> updateUserImage(@RequestParam("imageFile") MultipartFile imageFile) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        try {
            userImageService.update(imageFile, userId);
            return ResponseEntity.ok().body(ResponseDTO.setSuccess("User image updated successfully"));
        } catch (Exception e) {
            log.error("Failed to update user image for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.setFailed("Failed to update user image."));
        }
    }

}

package com.dg.deukgeun.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.dto.user.UserSignUpDTO;
import com.dg.deukgeun.entity.VerificationCode;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.EmailService;
import com.dg.deukgeun.service.GymService;
import com.dg.deukgeun.service.UserService;
import com.dg.deukgeun.service.VerificationCodeService;

@RestController
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

    // 인증번호 이메일 전송
    @PostMapping("/sendCode")
    public ResponseEntity<?> sendVerificationCode(@RequestBody VerificationCode codeEntity) {
        System.out.println("SendCode!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
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

    // 로그인
    @PostMapping("/login")
    public ResponseDTO<?> login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }

    @GetMapping("/userInfo")
    public ResponseDTO<?> getUserInfo() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        return userService.getUserInfo(userId);
    }

    // @GetMapping("/userInfo")
    // public ResponseDTO<?> getUserInfo(HttpServletRequest request) {
        // Integer userId = (Integer) request.getAttribute("userId");
    // return userService.getUserInfo(userId);
    // }

    @PutMapping("/update/{userId}")
    public ResponseDTO<?> updateUser(@PathVariable Integer userId, @RequestBody UpdateUserDTO updateUserDTO) {
        return userService.updateUser(updateUserDTO);
    }

    @PostMapping("/reqPwReset")
    public ResponseEntity<ResponseDTO<?>> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return ResponseEntity.ok(userService.requestPasswordReset(email));
    }

    @PostMapping("/resetPw")
    public ResponseEntity<ResponseDTO<?>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        return ResponseEntity.ok(userService.resetPassword(token, newPassword));
    }

}

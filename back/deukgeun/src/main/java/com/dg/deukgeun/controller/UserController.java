package com.dg.deukgeun.controller;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.dto.user.UserSignUpDTO;
import com.dg.deukgeun.entity.VerificationCode;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.service.EmailService;
import com.dg.deukgeun.service.UserService;
import com.dg.deukgeun.service.VerificationCodeService;

@RestController
@RequestMapping("/api")

public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;
    @Autowired
    VerificationCodeService codeService;

    // 인증번호 이메일 전송
    @PostMapping("/sendCode")
    public ResponseEntity<?> sendVerificationCode(@RequestParam String email) {
        if (!emailService.isValidEmailAddress(email)) {
            return ResponseEntity.badRequest().body("유효하지 않은 이메일입니다.");
        }
        VerificationCode codeEntity = codeService.createVerificationCode(email);
        emailService.sendVerificationEmail(email, codeEntity.getCode());
        return ResponseEntity.ok("이메일이 전송됐습니다. 인증번호: " + codeEntity.getCode());
    }

    // 인증번호 확인
    @PostMapping("/checkCode")
    public ResponseEntity<?> checkVerificationCode(@RequestBody VerificationCode codeEntity) {
        Optional<VerificationCode> codeOptional = Optional
                .ofNullable(codeService.getVerificationCode(codeEntity.getEmail(), codeEntity.getCode()));

        // 이메일 + 코드가 db에 존재하면
        if (codeOptional.isPresent()) {
            // 확인 됐으니 삭제
            codeService.deleteVerificationCode(codeOptional.get());
            // 만료 시간이 지났으면
            if (codeOptional.get().getExpiryDate().before(new Date())) {
                return ResponseEntity.badRequest().body("만료된 코드입니다.");
            }
            // 안지났으면 인증 완료
            return ResponseEntity.ok("인증이 완료됐습니다.");
        }

        // db에 존재하지 않으면 유요하지 않은 코드
        return ResponseEntity.badRequest().body("유효하지 않은 코드입니다.");
    }

    // 회원가입
    @PostMapping("/signUp")
    public ResponseDTO<?> signUp(@RequestBody UserSignUpDTO requestBody) {
        // codeService.deleteUnusedCode(requestBody.getEmail());
        ResponseDTO<?> result = userService.signUp(requestBody);
        return result;
    }

    // 로그인
    @PostMapping("/login")
    public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
        ResponseDTO<?> result = userService.login(requestBody);
        return result;
    }

    @GetMapping("/userInfo")
    public ResponseDTO<?> getUserInfo(@RequestParam String email) {
        ResponseDTO<?> result = userService.getUserInfo(email);
        return result;
    }

    @PutMapping("/update/{email}")
    public ResponseDTO<?> updateUser(@PathVariable String email, @RequestBody UpdateUserDTO updateUserDTO) {
        return userService.updateUser(updateUserDTO);
    }
}

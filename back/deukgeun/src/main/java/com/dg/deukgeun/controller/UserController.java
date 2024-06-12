package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.dto.user.UserSignUpDTO;
import com.dg.deukgeun.entity.VerificationCode;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.service.EmailService;
import com.dg.deukgeun.service.GymService;
import com.dg.deukgeun.service.UserService;
import com.dg.deukgeun.service.VerificationCodeService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

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
    // @PostMapping("/sendCode")
    // public ResponseEntity<?> sendVerificationCode(@RequestParam String email) {
    // if (!emailService.isValidEmailAddress(email)) {
    // return ResponseEntity.badRequest().body("유효하지 않은 이메일입니다.");
    // }
    // VerificationCode codeEntity = codeService.createVerificationCode(email);
    // emailService.sendVerificationEmail(email, codeEntity.getCode());
    // return ResponseEntity.ok("이메일이 전송됐습니다. 인증번호: " + codeEntity.getCode());
    // }

    // 인증번호 이메일 전송
    @PostMapping("/sendCode")
    public ResponseEntity<?> sendVerificationCode(@RequestBody VerificationCode codeEntity) {
        System.out.println("SendCode!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        try {
            if (!emailService.isValidEmailAddress(codeEntity.getEmail())) {
                return ResponseEntity.badRequest().body("유효하지 않은 이메일입니다.");
            }
            emailService.sendVerificationEmail(codeEntity.getEmail(), codeEntity.getCode());
        } catch(Exception e) {
            e.printStackTrace();
        }
        
        return ResponseEntity.ok("이메일이 전송됐습니다. 인증번호: " + codeEntity.getCode());
    }

    // 인증번호 확인
    // @PostMapping("/checkCode")
    // public ResponseEntity<?> checkVerificationCode(@RequestBody VerificationCode
    // codeEntity) {
    // Optional<VerificationCode> codeOptional = Optional
    // .ofNullable(codeService.getVerificationCode(codeEntity.getEmail(),
    // codeEntity.getCode()));

    // // 이메일 + 코드가 db에 존재하면
    // if (codeOptional.isPresent()) {
    // // 확인 됐으니 삭제
    // codeService.deleteVerificationCode(codeOptional.get());
    // // 만료 시간이 지났으면
    // if (codeOptional.get().getExpiryDate().before(new Date())) {
    // return ResponseEntity.badRequest().body("만료된 코드입니다.");
    // }
    // // 안지났으면 인증 완료
    // return ResponseEntity.ok("인증이 완료됐습니다.");
    // }

    // // db에 존재하지 않으면 유요하지 않은 코드
    // return ResponseEntity.badRequest().body("유효하지 않은 코드입니다.");
    // }

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
    public ResponseDTO<?> getUserInfo(HttpServletRequest request) {
        return userService.getUserInfo(request.getAttribute("email").toString());
    }

    @PutMapping("/update/{email}")
    public ResponseDTO<?> updateUser(@PathVariable String email, @RequestBody UpdateUserDTO updateUserDTO) {
        return userService.updateUser(updateUserDTO);
    }
}

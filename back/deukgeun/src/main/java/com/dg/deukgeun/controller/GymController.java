package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.service.GymService;

@RestController
@RequestMapping("/api/gym")

public class GymController {

    @Autowired
    private GymService gymService;

    // GYM 회원가입
    @PostMapping("/signUp")
    public ResponseDTO<?> registerGym(@RequestBody GymSignUpDTO requestBody) {
        return gymService.signUp(requestBody);
    }

//         // GYM 로그인
//     @PostMapping("/login")
//     public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
//         ResponseDTO<?> result = gymService.login(requestBody);
//         return result;
//     }
}

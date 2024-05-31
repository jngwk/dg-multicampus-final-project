package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.LoginDTO;
import com.dg.deukgeun.dto.ResponseDTO;
import com.dg.deukgeun.dto.SignUpDTO;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.service.AuthService;


@RestController
@RequestMapping("/api")

public class AuthController {

    @Autowired AuthService authService;
    @Autowired UserRepository userRepository;

    @PostMapping("/signUp")
    public ResponseDTO<?> signUp(@RequestBody SignUpDTO requestBody) {
        ResponseDTO<?> result = authService.signUp(requestBody);
        return result;
    }

    @PostMapping("/login")
    public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
        ResponseDTO<?> result = authService.login(requestBody);
        return result;
    }
}

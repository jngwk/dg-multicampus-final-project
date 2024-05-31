package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.SignUpDTO;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.service.UserService;


@RestController
@RequestMapping("/api")

public class UserController {

    @Autowired UserService userService;
    @Autowired UserRepository userRepository;

    @PostMapping("/signUp")
    public ResponseDTO<?> signUp(@RequestBody SignUpDTO requestBody) {
        ResponseDTO<?> result = userService.signUp(requestBody);
        return result;
    }

    @PostMapping("/login")
    public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
        ResponseDTO<?> result = userService.login(requestBody);
        return result;
    }
}

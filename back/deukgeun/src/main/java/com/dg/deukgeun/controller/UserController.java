package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.dg.deukgeun.dto.user.UserSignUpDTO;
import com.dg.deukgeun.dto.user.UpdateUserDTO;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.service.UserService;


@RestController
@RequestMapping("/api")

public class UserController {

    @Autowired UserService userService;
    @Autowired UserRepository userRepository;

    //회원가입
    @PostMapping("/signUp")
    public ResponseDTO<?> signUp(@RequestBody UserSignUpDTO requestBody) {
        ResponseDTO<?> result = userService.signUp(requestBody);
        return result;
    }

    //로그인
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

package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.service.UserService;

@RestController
public class AdminController {

    @Autowired
    UserService userService;

    @GetMapping("/admin/users")
    public ResponseDTO<?> getAllUsers(@RequestParam String adminEmail) {
        return userService.getAllUsers(adminEmail);
    }
}
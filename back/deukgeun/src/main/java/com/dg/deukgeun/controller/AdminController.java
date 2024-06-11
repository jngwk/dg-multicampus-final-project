package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseDTO<?> getAllUsers(@RequestParam String adminEmail, @RequestParam(required = false) String searchQuery) {
        if (searchQuery != null && !searchQuery.isEmpty()) {
            // 검색 쿼리가 제공되면 검색 기능을 사용하여 사용자를 가져옵니다.
            return adminService.getAllUsers(adminEmail, searchQuery);
        } else {
            // 검색 쿼리가 제공되지 않으면 기본적으로 모든 사용자를 가져옵니다.
            return adminService.getAllUsers(adminEmail, null);
        }
    }

    @GetMapping("/gymUsers")
    public ResponseDTO<?> getAllGymUsers(@RequestParam(required = false) String searchQuery) {
        return adminService.getAllGymUsers(searchQuery);
    }
}
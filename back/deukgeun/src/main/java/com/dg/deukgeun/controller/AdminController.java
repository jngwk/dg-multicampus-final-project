package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.page.PageRequestDTO;
import com.dg.deukgeun.dto.page.PageResponseDTO;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // @GetMapping("/users")
    // public PageResponseDTO<User> getAllUsers(@RequestParam Integer adminId,
    //                                          @RequestParam(required = false) String searchQuery,
    //                                          PageRequestDTO pageRequestDTO) {
    //     return adminService.getAllUsers(adminId, searchQuery, pageRequestDTO);
    // }
    @GetMapping("/users")
    public PageResponseDTO<User> getAllUsers(@RequestParam(required = false) String searchQuery,
                                             PageRequestDTO pageRequestDTO) {
        // 현재 인증된 사용자의 정보를 가져옵니다.
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = userDetails.getUserId();

        // AdminService의 getAllUsers 메소드를 호출하여 사용자 목록을 가져옵니다.
        return adminService.getAllUsers(userId, pageRequestDTO);
    }
    // @GetMapping("/gym-users")
    // public PageResponseDTO<Map<String, Object>> getAllGymUsers(@RequestParam(required = false) String searchQuery,
    //                                                            PageRequestDTO pageRequestDTO) {
    //     return adminService.getAllGymUsers(searchQuery, pageRequestDTO);
    // }
}
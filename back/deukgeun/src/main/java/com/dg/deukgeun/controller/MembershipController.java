package com.dg.deukgeun.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.gym.MembershipDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Membership;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.MembershipService;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping("/register")
    public ResponseDTO<?> registerMembership(@RequestBody MembershipDTO membershipDTO) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();

        return membershipService.registerMembership(membershipDTO, userId);
    }

    @GetMapping("/stats")
    public ResponseEntity<List<Membership>> getMembershipStats() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();

        List<Membership> stats = membershipService.getMembershipStatsByGymUserId(userId);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/findMembership")
    public ResponseEntity<?> findMembership() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = userDetails.getUserId();

        Optional<Membership> membership = membershipService.findMembership(userId);

        if (membership.isPresent()) {
            return ResponseEntity.ok(membership.get());
        } else {
            return ResponseEntity.ok(null);
        }
    }
}
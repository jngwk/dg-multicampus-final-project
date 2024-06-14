package com.dg.deukgeun.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dg.deukgeun.dto.gym.MembershipDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Membership;
import com.dg.deukgeun.service.MembershipService;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping("/register")
    public ResponseDTO<?> registerMembership(@RequestBody MembershipDTO membershipDTO, @AuthenticationPrincipal String userEmail) {
        return membershipService.registerMembership(membershipDTO, userEmail);
    }

    @GetMapping("/stats")
    public ResponseEntity<List<Membership>> getMembershipStats(@AuthenticationPrincipal String userEmail) {
        List<Membership> stats = membershipService.getMembershipStatsByGymUserEmail(userEmail);
        return ResponseEntity.ok(stats);
    }
}

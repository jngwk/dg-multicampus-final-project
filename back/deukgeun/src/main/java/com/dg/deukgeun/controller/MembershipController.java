package com.dg.deukgeun.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.dg.deukgeun.service.IamportService;
import com.dg.deukgeun.service.MembershipService;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;


@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;
    @Autowired
    private IamportService iamportService;

    @PreAuthorize("(hasRole('ROLE_GENERAL'))")
    @PostMapping("/register")
    public ResponseDTO<?> registerMembership(@RequestBody MembershipDTO membershipDTO) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = userDetails.getUserId();

        try {
            // Iamport 결제 검증
            IamportResponse<Payment> response = iamportService.verifyPayment(membershipDTO.getImpUid());
            
            if (response.getResponse() != null && response.getResponse().getStatus().equals("paid")) {
                // 결제가 성공한 경우 회원 등록 처리
                return membershipService.registerMembership(membershipDTO, userId);
            } else {
                // 결제가 실패하거나 완료되지 않은 경우
                return ResponseDTO.setFailed("결제가 완료되지 않았습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDTO.setFailed("결제 검증 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<List<Membership>> getMembershipStats() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication() .getPrincipal();
        Integer userId = userDetails.getUserId();
        List<Membership> stats = membershipService.getMembershipStatsByGymUserId(userId);

        return ResponseEntity.ok(stats);
    }
}
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
        //만약 유저아이디와 dto의 productId 가 이미 있을 때, 기존의 정보에 product days 만큼 만료일 추가
        //이 코드는 완전히 동일한 상품을 다시 재구매 했을때 작동.
        Optional<Membership> membershipOPT = membershipService.findMembershipByUserIdAndProductId(userId, membershipDTO.getProductId());
        if(!membershipOPT.isEmpty()){
            Membership membership = membershipOPT.orElseThrow();
            return membershipService.plusDays(membership);
        }
        //아니면 새로 입력 받기

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
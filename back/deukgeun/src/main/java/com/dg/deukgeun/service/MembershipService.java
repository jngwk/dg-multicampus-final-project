package com.dg.deukgeun.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.gym.MembershipDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.Membership;
import com.dg.deukgeun.entity.Product;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.MembershipRepository;
import com.dg.deukgeun.repository.ProductRepository;
import com.dg.deukgeun.repository.UserRepository;

@Service
public class MembershipService {

    @Autowired
    MembershipRepository membershipRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    GymRepository gymRepository;
    @Autowired
    ProductRepository productRepository;

    @PreAuthorize("(hasRole('ROLE_GENERAL')) &&" + "#userId == principal.userId")
    public ResponseDTO<?> registerMembership(MembershipDTO membershipDTO, Integer userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        Gym gym = gymRepository.findById(membershipDTO.getGymId()).orElse(null);
        //허승돈 수정
        Optional<Product> optionalProduct = productRepository.findById(membershipDTO.getProductId());
        Product product = optionalProduct.orElseThrow();
        
        if (user == null || gym == null || product==null) {
            return ResponseDTO.setFailed("사용자 또는 헬스장을 찾을 수 없습니다.");
        }
        //허승돈 수정 종료
        Optional<Membership> existingMembership = membershipRepository.findByUser(user);
        if (existingMembership.isPresent()) {
            return ResponseDTO.setFailed("이미 등록된 회원입니다.");
        }

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setGym(gym);
        membership.setRegDate(membershipDTO.getRegDate());
        membership.setExpDate(membershipDTO.getExpDate());
        membership.setUserMemberReason(membershipDTO.getUserMemberReason());
        membership.setUserGender(membershipDTO.getUserGender());
        membership.setUserAge(membershipDTO.getUserAge());
        membership.setUserWorkoutDuration(membershipDTO.getUserWorkoutDuration());
        membership.setProduct(product);

        try {
            membershipRepository.save(membership);
            return ResponseDTO.setSuccess("회원 등록에 성공하였습니다.");
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
    }

    //허승돈 작성
    public Integer register(MembershipDTO membershipDTO, Integer userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        Gym gym = gymRepository.findById(membershipDTO.getGymId()).orElse(null);
        Optional<Product> optionalProduct = productRepository.findById(membershipDTO.getProductId());
        Product product = optionalProduct.orElseThrow();
        if (user == null || gym == null) {
            return -1;
        }

        // Optional<Membership> existingMembership = membershipRepository.findByUser(user);
        // if (existingMembership.isPresent()) {
        //     return ResponseDTO.setFailed("이미 등록된 회원입니다.");
        // }

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setGym(gym);
        membership.setRegDate(membershipDTO.getRegDate());
        membership.setExpDate(membershipDTO.getExpDate());
        membership.setUserMemberReason(membershipDTO.getUserMemberReason());
        membership.setUserGender(membershipDTO.getUserGender());
        membership.setUserAge(membershipDTO.getUserAge());
        membership.setUserWorkoutDuration(membershipDTO.getUserWorkoutDuration());
        membership.setProduct(product);

        try {
            Membership savedmembership = membershipRepository.save(membership);
            return savedmembership.getMembershipId();
        } catch (Exception e) {
            return -1;
        }
    }
    //허승돈 작성 종료

    @PreAuthorize("(hasRole('ROLE_GYM')) && #userId == principal.userId")
    public List<Membership> getMembershipStatsByGymUserId(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            Optional<Gym> gym = gymRepository.findByUser(user);
            if (gym.isPresent()) {
                return membershipRepository.findByGym_GymId(gym.get().getGymId());
            }
        }
        return Collections.emptyList(); // Return an empty list if no memberships found
    }

    //멤버십이 존재하는지 확인용
    @PreAuthorize("(hasRole('ROLE_GENERAL')) &&" + "#userId == principal.userId")
    public Optional<Membership> findMembership(Integer userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        if (user != null) {
            return membershipRepository.findByUser(user);
        }
        return Optional.empty(); // Return empty optional if user not found
    }
}

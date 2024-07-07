package com.dg.deukgeun.service;

import java.util.Collections;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

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
    @Autowired
    IamportService iamportService;

    @PreAuthorize("(hasRole('ROLE_GENERAL')) &&" + "#userId == principal.userId")
    public ResponseDTO<?> registerMembership(MembershipDTO membershipDTO, Integer userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        Gym gym = gymRepository.findById(membershipDTO.getGymId()).orElse(null);
        // 허승돈 수정
        Optional<Product> optionalProduct = productRepository.findById(membershipDTO.getProductId());
        Product product = optionalProduct.orElseThrow();

        if (user == null || gym == null || product == null) {
            return ResponseDTO.setFailed("사용자 또는 헬스장을 찾을 수 없습니다.");
        }
        // 허승돈 수정 종료
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

    //허승돈 수정
    @PreAuthorize("(hasRole('ROLE_GENERAL')) &&" + "#userId == principal.userId")
    public ResponseDTO<?> plusDays(Membership membership){
        LocalDate newExp = LocalDate.parse(membership.getExpDate()).plusDays(membership.getProduct().getDays());
        membership.setExpDate(newExp.toString());
        try {
            membershipRepository.save(membership);
            return ResponseDTO.setSuccess("기존의 맴버쉽 정보가 있습니다. 맴버십 기간을 연장합니다.");
        } catch(Exception e){
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
    }
    //허승돈 수정 종료

    // IAMPORT와의 결제 인증이 완료된 후 회원권 등록을 처리하는 메서드
    public ResponseDTO<?> processMembershipRegistrationAfterPayment(MembershipDTO membershipDTO, Integer userId,
            String impUid) {
        try {
            // IAMPORT 결제 인증
            IamportResponse<Payment> response = iamportService.verifyPayment(impUid);
            Payment payment = response.getResponse();

            if (payment != null && "paid".equals(payment.getStatus())) {
                // 결제 인증 성공, 회원권 등록 진행
                return registerMembership(membershipDTO, userId);
            } else {
                return ResponseDTO.setFailed("결제 인증에 실패하였습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("결제 인증 중 오류가 발생하였습니다.");
        }
    }

    // 허승돈 작성
    public Integer register(MembershipDTO membershipDTO, Integer userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        Gym gym = gymRepository.findById(membershipDTO.getGymId()).orElse(null);
        Optional<Product> optionalProduct = productRepository.findById(membershipDTO.getProductId());
        Product product = optionalProduct.orElseThrow();
        if (user == null || gym == null) {
            return -1;
        }

        // Optional<Membership> existingMembership =
        // membershipRepository.findByUser(user);
        // if (existingMembership.isPresent()) {
        // return ResponseDTO.setFailed("이미 등록된 회원입니다.");
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
    // 허승돈 작성 종료

    @PreAuthorize("(hasRole('ROLE_GYM'))")
    public List<Membership> getMembershipStatsByGymUserId(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            Optional<Gym> gym = gymRepository.findByUser(user);
            if (gym.isPresent()) {
                return membershipRepository.findAllByGym_GymId(gym.get().getGymId());
            }
        }
        return Collections.emptyList(); // Return an empty list if no memberships found
    }

    // 멤버십이 존재하는지 확인용
    @PreAuthorize("(hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM')) && #userId == principal.userId")
    public Optional<Membership> findMembership(Integer userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        if (user != null) {
            return membershipRepository.findByUser(user);
        }
        return Optional.empty(); // Return empty optional if user not found
    }

    public void deleteExpiredMemberships() {
        LocalDate today = LocalDate.now();
        String expirationDate = today.toString();
        // TODO 삭제 말고 state를 바꿔주는 쪽으로 고민
        membershipRepository.deleteByExpDate(expirationDate);
    }

    public ResponseEntity<String> checkExp(Integer userId) {
        LocalDate today = LocalDate.now();
        String expired = today.toString();
        String expiring = today.plusDays(7).toString();
        Optional<Membership> membership = membershipRepository.findByUser_UserId(userId);
        if (membership.isPresent()) {
            if (membership.get().getExpDate().equals(expired)) {
                return ResponseEntity.ok().body("expired");
            } else if (membership.get().getExpDate().equals(expiring)) {
                return ResponseEntity.ok().body("expiring");
            } else {
                return ResponseEntity.ok().body("not expiring");
            }
        } else {
            return ResponseEntity.badRequest().body("no membership");
        }
    }
}

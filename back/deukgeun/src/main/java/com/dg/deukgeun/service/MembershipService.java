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
import com.dg.deukgeun.entity.PaymentEntity;
import com.dg.deukgeun.entity.Product;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.MembershipRepository;
import com.dg.deukgeun.repository.PaymentRepository;
import com.dg.deukgeun.repository.ProductRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MembershipService {

    @Autowired
    MembershipRepository membershipRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    GymRepository gymRepository;
    @Autowired
    IamportService iamportService;
    @Autowired
    ProductRepository productRepository;

    @Autowired
    PaymentRepository paymentRepository; // PaymentRepository 주입

    @PreAuthorize("(hasRole('ROLE_GENERAL')) && #userId == principal.userId")
@Transactional
public ResponseDTO<?> registerMembership(MembershipDTO membershipDTO, Integer userId) {
    log.info("Registering membership for userId: {}", userId);
    log.info("MembershipDTO: {}", membershipDTO);

    User user = userRepository.findByUserId(userId).orElse(null);
    Gym gym = gymRepository.findById(membershipDTO.getGymId()).orElse(null);
    Optional<Product> optionalProduct = productRepository.findById(membershipDTO.getProductId());
    Product product = optionalProduct.orElseThrow();

    if (user == null || gym == null || product == null) {
        return ResponseDTO.setFailed("사용자 또는 헬스장을 찾을 수 없습니다.");
    }

    try {
        log.info("Verifying payment with impUid: {}", membershipDTO.getImpUid());
        IamportResponse<Payment> response = iamportService.verifyPayment(membershipDTO.getImpUid());
        log.info("Payment verification response: {}", response);

        if (response.getResponse() == null || !"paid".equals(response.getResponse().getStatus())) {
            return ResponseDTO.setFailed("결제가 완료되지 않았습니다.");
        }

        // 결제 정보 저장
        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setImpUid(membershipDTO.getImpUid());
        paymentEntity.setMerchantUid(response.getResponse().getMerchantUid());
        paymentEntity.setPaidAmount(response.getResponse().getAmount().intValue());
        paymentEntity.setApplyNum(response.getResponse().getApplyNum());
        paymentEntity.setStatus(response.getResponse().getStatus());
        paymentRepository.save(paymentEntity);

    } catch (Exception e) {
        log.error("Error during payment verification", e);
        return ResponseDTO.setFailed("결제 검증 중 오류가 발생했습니다.");
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
        log.error("Error during membership save", e);
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

}

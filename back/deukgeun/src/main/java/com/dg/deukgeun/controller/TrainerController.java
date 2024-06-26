package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.gym.TrainerDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.TrainerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
@Log4j2
public class TrainerController {

    // @Autowired
    // private TrainerService trainerService;

    // // Trainer 회원가입
    // @PostMapping("/user/signUp/trainer")
    // public ResponseDTO<?> signUp(@RequestBody TrainerDTO trainerDTO) {
    //     CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
    //             .getPrincipal();
    //     Integer gymUserId = userDetails.getUserId();
    //     return trainerService.signUp(trainerDTO, gymUserId);
    // }
    @Autowired
    private final TrainerService trainerService;
    
    @PutMapping("/update/{trainerId}")
    public ResponseDTO<?> updateTrainer(
            @PathVariable Integer trainerId,
            @RequestBody TrainerDTO trainerDTO) {
        try {
            log.info("Update request received for trainer ID: {}", trainerId);

            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Integer userId = userDetails.getUserId();

            trainerService.updateTrainer(trainerId, trainerDTO, userId);
            return ResponseDTO.setSuccess("Trainer updated successfully.");
        } catch (Exception e) {
            log.error("Failed to update trainer for ID: {}", trainerId, e);
            return ResponseDTO.setFailed("Failed to update trainer.");
        }
    }

}

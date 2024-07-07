package com.dg.deukgeun.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.gym.TrainerDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.TrainerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/trainer")
@RequiredArgsConstructor
@Log4j2
public class TrainerController {

    // @Autowired
    // private TrainerService trainerService;

    // // Trainer 회원가입
    // @PostMapping("/user/signUp/trainer")
    // public ResponseDTO<?> signUp(@RequestBody TrainerDTO trainerDTO) {
    // CustomUserDetails userDetails = (CustomUserDetails)
    // SecurityContextHolder.getContext().getAuthentication()
    // .getPrincipal();
    // Integer gymUserId = userDetails.getUserId();
    // return trainerService.signUp(trainerDTO, gymUserId);
    // }
    @Autowired
    private final TrainerService trainerService;

    @PutMapping("/update/{trainerId}")
    public ResponseDTO<?> updateTrainer(
            @PathVariable Integer trainerId,
            @RequestBody TrainerDTO trainerDTO) {
        try {
            log.info("Update request received for trainer ID: {}", trainerId);

            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            Integer userId = userDetails.getUserId();

            trainerService.updateTrainer(trainerId, trainerDTO, userId);
            return ResponseDTO.setSuccess("Trainer updated successfully.");
        } catch (Exception e) {
            log.error("Failed to update trainer for ID: {}", trainerId, e);
            return ResponseDTO.setFailed("Failed to update trainer.");
        }
    }

    @GetMapping("/getTrainerInfo/{userId}")
    public ResponseEntity<?> getTrainerInfo(@PathVariable Integer userId) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer currentUserId = userDetails.getUserId();

        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseDTO.setFailed("Unauthorized access"));
        }

        try {
            List<TrainerDTO> trainers = trainerService.getTrainerList(userId);
            if (trainers.isEmpty()) {
                return ResponseEntity.ok(ResponseDTO.setSuccess("No trainers found"));
            }
            return ResponseEntity
                    .ok(ResponseDTO.setSuccessData("Trainer information retrieved successfully", trainers));
        } catch (Exception e) {
            log.error("Failed to retrieve trainer information for user ID: {}", userId, e);
            return ResponseEntity.badRequest().body(ResponseDTO.setFailed("Failed to retrieve trainer information"));
        }
    }

    @PutMapping("/updateUserDetails/{trainerId}")
    public ResponseDTO<?> updateTrainerUserDetails(
            @PathVariable Integer trainerId,
            @RequestBody TrainerDTO trainerDTO) {
        try {
            log.info("Update request received for trainer ID: {}", trainerId);

            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            Integer userId = userDetails.getUserId();

            trainerService.updateTrainerUserDetails(trainerId, trainerDTO.getUserName(), trainerDTO.getEmail());
            return ResponseDTO.setSuccess("Trainer user details updated successfully.");
        } catch (Exception e) {
            log.error("Failed to update trainer user details for ID: {}", trainerId, e);
            return ResponseDTO.setFailed("Failed to update trainer user details.");
        }
    }

    @DeleteMapping("/delete/{trainerId}")
    public ResponseDTO<?> deleteTrainer(@PathVariable Integer trainerId) {
        try {
            log.info("Delete request received for trainer ID: {}", trainerId);

            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            Integer userId = userDetails.getUserId();

            trainerService.deleteTrainer(trainerId, userId);
            return ResponseDTO.setSuccess("Trainer deleted successfully.");
        } catch (Exception e) {
            log.error("Failed to delete trainer for ID: {}", trainerId, e);
            return ResponseDTO.setFailed("Failed to delete trainer.");
        }
    }

    @GetMapping("/get/{userId}")
    public Trainer getTrainer(@PathVariable(name = "userId") Integer userId) {
        return trainerService.get(userId);
    }
}

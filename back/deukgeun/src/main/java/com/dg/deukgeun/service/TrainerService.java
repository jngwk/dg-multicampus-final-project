package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.dto.gym.TrainerDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class TrainerService {

    private static final Logger logger = LoggerFactory.getLogger(TrainerService.class);
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final GymRepository gymRepository;

    public List<TrainerDTO> getList(Integer gymId) {
        List<Trainer> result = trainerRepository.findAllBygymGymId(gymId);
        List<TrainerDTO> dtoList = new ArrayList<>();
        for (int i = 0; i < result.size(); i++) {
            TrainerDTO dto = new TrainerDTO();
            dto.setGymId(gymId);
            dto.setTrainerCareer(result.get(i).getTrainerCareer());
            dto.setTrainerId(result.get(i).getTrainerId());
            dto.setTrainerImage(result.get(i).getTrainerImage());
            dto.setUserName(result.get(i).getUser().getUserName());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public List<Trainer> getTrainerListWithInfo(Integer gymId) {
        return trainerRepository.findAllBygymGymId(gymId);
    }

    public ResponseDTO<?> signUp(TrainerDTO trainerDTO, Integer userId) {
        String email = trainerDTO.getEmail();
        String password = trainerDTO.getPassword();

        logger.info("Trainer sign-up initiated for email: {}", email);

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            logger.warn("Email already exists: {}", email);
            return ResponseDTO.setFailed("중복된 Email 입니다.");
        }

        // Hash the password
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        // Create User entity
        User user = new User();
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setUserName(trainerDTO.getUserName());
        user.setAddress(trainerDTO.getAddress());
        user.setDetailAddress(trainerDTO.getDetailAddress());
        user.setRole(UserRole.ROLE_TRAINER);

        logger.info("User entity created for email: {}", email);

        // Save User entity
        try {
            userRepository.save(user);
            logger.info("User entity saved for email: {}", email);
        } catch (Exception e) {
            logger.error("Failed to save user entity to the database.", e);
            return ResponseDTO.setFailed("사용자 정보를 저장하는 도중 오류가 발생했습니다.");
        }

        // Find Gym by userId
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            log.debug(userOptional);
            return ResponseDTO.setFailed("유효하지 않은 User ID 입니다.");
        }

        System.out.println(userOptional);

        Optional<Gym> gymOptional = gymRepository.findByUser(userOptional.get());
        if (gymOptional.isEmpty()) {
            log.debug(gymOptional);
            return ResponseDTO.setFailed("해당 사용자에게 연결된 Gym을 찾을 수 없습니다.");
        }
        Gym gym = gymOptional.get();

        // Create Trainer entity
        Trainer trainer = new Trainer();
        trainer.setUser(user);
        trainer.setGym(gym);
        trainer.setTrainerCareer(trainerDTO.getTrainerCareer());
        trainer.setTrainerAbout(trainerDTO.getTrainerAbout());
        trainer.setTrainerImage(trainerDTO.getTrainerImage());

        logger.info("Trainer entity created for user: {}", user.getEmail());

        // Save Trainer entity
        try {
            trainerRepository.save(trainer);
            logger.info("Trainer entity saved for user: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to save trainer entity to the database.", e);
            return ResponseDTO.setFailed("트레이너 정보를 저장하는 도중 오류가 발생했습니다.");
        }

        return ResponseDTO.setSuccess("트레이너 생성에 성공했습니다.");
    }

    @PreAuthorize("hasRole('ROLE_TRAINER')")
    public void updateTrainer(Integer trainerId, TrainerDTO trainerDTO, Integer userId) {
        Optional<Trainer> optionalTrainer = trainerRepository.findById(trainerId);
        if (optionalTrainer.isPresent()) {
            Trainer trainer = optionalTrainer.get();
            if (trainer.getUser().getUserId().equals(userId)) {
                logger.info("Original Trainer: {}", trainer);
                trainer.setTrainerCareer(trainerDTO.getTrainerCareer());
                trainer.setTrainerAbout(trainerDTO.getTrainerAbout());
                trainer.setTrainerImage(trainerDTO.getTrainerImage());

                if (trainerDTO.getUserName() != null) {
                    trainer.getUser().setUserName(trainerDTO.getUserName());
                }
                if (trainerDTO.getAddress() != null) {
                    trainer.getUser().setAddress(trainerDTO.getAddress());
                }
                if (trainerDTO.getDetailAddress() != null) {
                    trainer.getUser().setDetailAddress(trainerDTO.getDetailAddress());
                }

                trainerRepository.save(trainer);
                logger.info("Updated Trainer: {}", trainer);
                logger.info("Trainer saved successfully.");
            } else {
                logger.warn("User is not authorized to update this trainer.");
            }
        } else {
            logger.warn("Trainer not found.");
        }
    }

    public Trainer get(Integer userId) {
        return trainerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
    }
}

package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.PtSessionDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.PtSession;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.PtSessionRepository;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PtSessionService {
    private final ModelMapper modelMapper;
    private final PtSessionRepository ptSessionRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final TrainerRepository trainerRepository;
    @Autowired
    private final GymRepository gymRepository;

    public Integer insert(PtSession ptSession) {
        PtSession savedPtSession = ptSessionRepository.save(ptSession);
        return savedPtSession.getPtSessionId();
    }

    public List<PtSessionDTO> findPTSession(Integer trainerId) {
        List<PtSession> ptSessionList = ptSessionRepository.findByTrainer_TrainerId(trainerId);
        List<PtSessionDTO> dtoList = new ArrayList<>();
        for (int i = 0; i < ptSessionList.size(); i++) {
            dtoList.add(modelMapper.map(ptSessionList.get(i), PtSessionDTO.class));
        }
        return dtoList;
    }

    public PtSessionDTO selectById(Integer ptSessionId) {
        Optional<PtSession> result = ptSessionRepository.findById(ptSessionId);
        PtSession ptSession = result.orElseThrow();

        PtSessionDTO ptSessionDTO = modelMapper.map(ptSession, PtSessionDTO.class);
        return ptSessionDTO;
    }

    public void update(PtSessionDTO ptSessionDTO) {
        Optional<PtSession> result = ptSessionRepository.findById(ptSessionDTO.getPtSessionId());
        PtSession ptSession = result.orElseThrow();

        ptSessionRepository.save(ptSession);
    }

    public void delete(Integer ptSessionId) {
        ptSessionRepository.deleteById(ptSessionId);
    }

    //헬스장
    public List<PtSessionDTO> getPtSession(Integer userId) {
        // 1. Retrieve gymId using userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Gym gym = gymRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Gym not found for the user"));
    
        // Log user and gym information
        System.out.println("User ID: " + user.getUserId());
        System.out.println("Gym ID: " + gym.getGymId());
    
        // 2. Retrieve trainers associated with the same gymId
        List<Trainer> trainers = trainerRepository.findAllBygymGymId(gym.getGymId());
    
        // Log the number of trainers found
        System.out.println("Number of trainers found: " + trainers.size());
    
        // 3. Extract trainerIds from trainers list
        List<Integer> trainerIds = trainers.stream()
                .map(Trainer::getTrainerId)
                .collect(Collectors.toList());
    
        // Log trainer IDs
        System.out.println("Trainer IDs: " + trainerIds);
    
        // Verify that trainer IDs are correct and not empty
        if (trainerIds.isEmpty()) {
            System.out.println("No trainer IDs found for gym ID: " + gym.getGymId());
            return new ArrayList<>(); // Return an empty list if no trainer IDs are found
        }
    
        // 4. Initialize an empty list to store all PtSessionDTOs
        List<PtSessionDTO> ptSessionDTOs = new ArrayList<>();
    
        // 5. Loop through each trainerId and query PtSessionRepository to get PtSessions associated with that trainerId
        for (Integer trainerId : trainerIds) {
            List<PtSession> ptSessions = ptSessionRepository.findByTrainer_TrainerId(trainerId);
    
            // Log the number of PT sessions found for the current trainerId
            System.out.println("Number of PT sessions found for trainer ID " + trainerId + ": " + ptSessions.size());
    
            // Map PtSession entities to PtSessionDTOs and add to ptSessionDTOs list
            List<PtSessionDTO> mappedDTOs = ptSessions.stream()
                    .map(ptSession -> mapPtSessionToDto(ptSession))
                    .collect(Collectors.toList());
    
            // Add mapped DTOs to the main list
            ptSessionDTOs.addAll(mappedDTOs);
        }
    
        // Log the final DTO list
        System.out.println("PT Session DTOs: " + ptSessionDTOs);
    
        return ptSessionDTOs;
    }
    
    private PtSessionDTO mapPtSessionToDto(PtSession ptSession) {
        ModelMapper modelMapper = new ModelMapper();
        
        // Configure ModelMapper to explicitly map ptId from PersonalTraining entity
        modelMapper.typeMap(PtSession.class, PtSessionDTO.class)
                .addMapping(src -> src.getPt().getPtId(), PtSessionDTO::setPtId);
    
        return modelMapper.map(ptSession, PtSessionDTO.class);
    }
    
}
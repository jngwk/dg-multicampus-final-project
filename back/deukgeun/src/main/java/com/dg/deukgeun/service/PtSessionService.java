package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.PtSessionDTO;
import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.PersonalTraining;
import com.dg.deukgeun.entity.PtSession;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.entity.WorkoutSession;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.PersonalTrainingRepository;
import com.dg.deukgeun.repository.PtSessionRepository;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.repository.WorkoutSessionRepository;

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
    @Autowired
    private final PersonalTrainingRepository personalTrainingRepository;
    @Autowired
    private final WorkoutSessionRepository workoutSessionRepository;


    

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
    public List<WorkoutSessionDTO> getPtSession(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Gym gym = gymRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Gym not found for the user"));

        List<Trainer> trainers = trainerRepository.findAllBygymGymId(gym.getGymId());
 
        List<Integer> trainerIds = trainers.stream()
                .map(Trainer::getTrainerId)
                .collect(Collectors.toList());
 
        if (trainerIds.isEmpty()) {
            System.out.println("No trainer IDs found for gym ID: " + gym.getGymId());
            return new ArrayList<>(); // Return an empty list if no trainer IDs are found
        }

        List<Integer> allUserIds = new ArrayList<>();
        for (Integer trainerId : trainerIds) {
            List<Integer> userIDsForTrainer = personalTrainingRepository.findAllByTrainer_TrainerId(trainerId)
                    .stream()
                    .map(pt -> pt.getUser().getUserId())
                    .collect(Collectors.toList());
            allUserIds.addAll(userIDsForTrainer);
        }

        List<WorkoutSession> workoutSessions = workoutSessionRepository
                .findByUser_UserIdInAndPtSessionIsNotNull(allUserIds);


        List<WorkoutSessionDTO> workoutSessionDTOs = workoutSessions.stream()
                .filter(workoutSession -> workoutSession.getPtSession() != null) // Filter out sessions with null ptSession
                .map(workoutSession -> modelMapper.map(workoutSession, WorkoutSessionDTO.class))
                .collect(Collectors.toList());

        // Log mapped WorkoutSessionDTOs
        // workoutSessionDTOs.forEach(dto -> System.out.println("Mapped WorkoutSessionDTO: " + dto));

        return workoutSessionDTOs;
    }
}
package com.dg.deukgeun.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.PtSessionDTO;
import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.WorkoutSession;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.repository.WorkoutSessionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class WorkoutSessionService {
    private final ModelMapper modelMapper;
    private final WorkoutSessionRepository workoutSessionRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    public Integer register(WorkoutSessionDTO workoutSessionDTO) {
        log.info("--------------------");
        WorkoutSession workoutSession = modelMapper.map(workoutSessionDTO, WorkoutSession.class);
        WorkoutSession savedWorkoutSession = workoutSessionRepository.save(workoutSession);
        return savedWorkoutSession.getWorkoutSessionId();
    }

    public WorkoutSessionDTO get(Integer workoutSessionId) {
        Optional<WorkoutSession> result = workoutSessionRepository.findById(workoutSessionId);
        WorkoutSession workoutSession = result.orElseThrow();
        WorkoutSessionDTO dto = modelMapper.map(workoutSession, WorkoutSessionDTO.class);
        return dto;
    }

    public List<WorkoutSessionDTO> get(Integer userId, LocalDate startDate, LocalDate endDate) {
        log.info("id", userId);
        List<WorkoutSession> result = workoutSessionRepository.findByUser_UserIdAndWorkoutDateBetween(userId, startDate,
                endDate);
        List<WorkoutSessionDTO> dtoList = new ArrayList<WorkoutSessionDTO>();
        for (int i = 0; i < result.size(); i++) {
            dtoList.add(modelMapper.map(result.get(i), WorkoutSessionDTO.class));
        }
        return dtoList;
    }

    public List<WorkoutSessionDTO> getForTrainer(Integer userId, LocalDate startDate, LocalDate endDate) {
        Trainer trainer = trainerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
        List<WorkoutSessionDTO> dtoList = new ArrayList<WorkoutSessionDTO>();
        List<WorkoutSession> list = workoutSessionRepository
                .findByPtSession_TrainerAndWorkoutDateBetween(trainer, startDate, endDate).orElse(null);
        for (int i = 0; i < list.size(); i++) {
            dtoList.add(modelMapper.map(list.get(i), WorkoutSessionDTO.class));
        }
        return dtoList;
    }

    public void modify(WorkoutSessionDTO workoutSessionDTO) {
        Optional<WorkoutSession> result = workoutSessionRepository.findById(workoutSessionDTO.getWorkoutSessionId());

        WorkoutSession workoutSession = result.orElseThrow();
        // log.info("result", workoutSessionDTO.toString());
        workoutSession.setBodyWeight(workoutSessionDTO.getBodyWeight());
        workoutSession.setContent(workoutSessionDTO.getContent());
        workoutSession.setMemo(workoutSessionDTO.getMemo());
        workoutSession.setPtSession(workoutSessionDTO.getPtSession());

        workoutSession.setUser(userRepository.findById(workoutSessionDTO.getUserId()).get());
        // log.info("userId???", workoutSessionDTO.getUserId());
        workoutSession.setWorkoutDate(workoutSessionDTO.getWorkoutDate());
        workoutSession.setWorkoutSessionId(workoutSessionDTO.getWorkoutSessionId());
        workoutSession.setStartTime(workoutSessionDTO.getStartTime());
        workoutSession.setEndTime(workoutSessionDTO.getEndTime());
        workoutSessionRepository.save(workoutSession);
    }

    public void updateByPtSession(PtSessionDTO ptSessionDTO) {
        Optional<WorkoutSession> result = workoutSessionRepository
                .findByPtSession_PtSessionId(ptSessionDTO.getPtSessionId());

        WorkoutSession workoutSession = result.orElseThrow();

        workoutSessionRepository.save(workoutSession);
    }

    public void remove(Integer workoutSessionId) {
        workoutSessionRepository.deleteById(workoutSessionId);
    }

    public void deleteByPtSession(Integer ptSessionId) {
        workoutSessionRepository.deleteByPtSession_PtSessionId(ptSessionId);
    }

}

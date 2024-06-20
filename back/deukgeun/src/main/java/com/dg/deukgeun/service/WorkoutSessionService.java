package com.dg.deukgeun.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.entity.WorkoutSession;
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
        List<WorkoutSession> result = workoutSessionRepository.findByUserIdAndWorkoutDateBetween(userId, startDate,
                endDate);
        List<WorkoutSessionDTO> dtoList = new ArrayList<WorkoutSessionDTO>();
        for (int i = 0; i < result.size(); i++) {
            dtoList.add(modelMapper.map(result.get(i), WorkoutSessionDTO.class));
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
        workoutSession.setPtSessionId(workoutSessionDTO.getPtSessionId());
        workoutSession.setUserId(workoutSessionDTO.getUserId());
        // log.info("userId???", workoutSessionDTO.getUserId());
        workoutSession.setWorkoutDate(workoutSessionDTO.getWorkoutDate());
        workoutSession.setWorkoutSessionId(workoutSessionDTO.getWorkoutSessionId());
        workoutSession.setStartTime(workoutSessionDTO.getStartTime());
        workoutSession.setEndTime(workoutSessionDTO.getEndTime());
        workoutSessionRepository.save(workoutSession);
    }

    public void remove(Integer workoutSessionId) {
        workoutSessionRepository.deleteById(workoutSessionId);
    }
}

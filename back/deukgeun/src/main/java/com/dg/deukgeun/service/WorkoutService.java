package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.WorkoutDTO;
import com.dg.deukgeun.entity.Workout;
import com.dg.deukgeun.repository.WorkoutRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class WorkoutService {
    private final ModelMapper modelMapper;
    private final WorkoutRepository workoutRepository;

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public Integer register(WorkoutDTO workoutDTO) { // workout 정보 입력
        log.info("--------------------");
        Workout workout = modelMapper.map(workoutDTO, Workout.class);
        Workout savedWorkout = workoutRepository.save(workout);
        return savedWorkout.getWorkoutId();
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public void insertList(List<WorkoutDTO> dtoList) {
        List<Workout> workoutList = new ArrayList<Workout>();
        for (int i = 0; i < dtoList.size(); i++) {
            workoutList.add(modelMapper.map(dtoList.get(i), Workout.class));
        }
        workoutRepository.saveAll(workoutList);
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public WorkoutDTO get(Integer workoutId) { // workoutId를 기준으로 read
        Optional<Workout> result = workoutRepository.findById(workoutId);
        Workout workout = result.orElseThrow();
        WorkoutDTO dto = modelMapper.map(workout, WorkoutDTO.class);
        return dto;
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public List<WorkoutDTO> getByWorkoutSessionId(Integer workoutSessionId) {
        List<Workout> result = workoutRepository.findByWorkoutSessionId(workoutSessionId);
        List<WorkoutDTO> dtoList = new ArrayList<WorkoutDTO>();
        for (int i = 0; i < result.size(); i++) {
            dtoList.add(modelMapper.map(result.get(i), WorkoutDTO.class));
        }
        return dtoList;
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public void modify(WorkoutDTO workoutDTO) { // workoutId를 기준으로 update
        Optional<Workout> result = workoutRepository.findById(workoutDTO.getWorkoutId());
        Workout workout = result.orElseThrow();
        workout.setWorkoutWeight(workoutDTO.getWorkoutWeight());
        workout.setWorkoutName(workoutDTO.getWorkoutName());
        workout.setWorkoutRep(workoutDTO.getWorkoutRep());
        workout.setWorkoutSet(workoutDTO.getWorkoutSet());
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public void remove(Integer workoutId) {
        workoutRepository.deleteById(workoutId);
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public void removeByWorkoutSessionId(Integer workoutSessionId) {
        workoutRepository.deleteByWorkoutSessionId(workoutSessionId);
    }
}

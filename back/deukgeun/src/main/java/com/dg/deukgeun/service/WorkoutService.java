package com.dg.deukgeun.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.domain.Workout;
import com.dg.deukgeun.dto.WorkoutDTO;
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

    public Integer register(WorkoutDTO workoutDTO){
        log.info("--------------------");
        Workout workout = modelMapper.map(workoutDTO,Workout.class);
        Workout savedWorkout = workoutRepository.save(workout);
        return savedWorkout.getWorkoutId();
    }
}

package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
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

    public Integer register(WorkoutDTO workoutDTO){ //workout 정보 입력
        log.info("--------------------");
        Workout workout = modelMapper.map(workoutDTO,Workout.class);
        Workout savedWorkout = workoutRepository.save(workout);
        return savedWorkout.getWorkoutId();
    }
    public WorkoutDTO get(Integer workoutId){ //workoutId를 기준으로 read
        Optional<Workout> result = workoutRepository.findById(workoutId);
        Workout workout = result.orElseThrow();
        WorkoutDTO dto = modelMapper.map(workout,WorkoutDTO.class);
        return dto;
    }

    public List<WorkoutDTO> getByWorkoutSessionId(Integer workoutSessionId){
        List<Workout> result = workoutRepository.findByWorkoutSessionId(workoutSessionId);
        List<WorkoutDTO> dtoList = new ArrayList<WorkoutDTO>();
        for(int i=0;i<result.size();i++){
            dtoList.add(modelMapper.map(result.get(i),WorkoutDTO.class));
        }
        return dtoList;
    }

    public void modify(WorkoutDTO workoutDTO){ //workoutId를 기준으로 update
        Optional<Workout> result = workoutRepository.findById(workoutDTO.getWorkoutId());
        Workout workout = result.orElseThrow();
        workout.setWeight(workoutDTO.getWeight());
        workout.setWorkoutName(workoutDTO.getWorkoutName());
        workout.setWorkoutRep(workoutDTO.getWorkoutRep());
        workout.setWorkoutSet(workoutDTO.getWorkoutSet());
    }
    public void remove(Integer workoutId){
        workoutRepository.deleteById(workoutId);
    }
}

package com.dg.deukgeun.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.WorkoutDTO;
import com.dg.deukgeun.service.WorkoutService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/workoutSession")
public class WorkoutController {
    private final WorkoutService service;

    // @GetMapping("/{workoutId}")
    // public WorkoutDTO get(@PathVariable(name="workoutId") Integer workoutId){
    //     return service.get(workoutId);
    // }

    @GetMapping("/{yearMonth}/{workoutSessionId}")
    public List<WorkoutDTO> get(@PathVariable(name="workoutSessionId") Integer workoutSessionId){
        return service.getByWorkoutSessionId(workoutSessionId);
    }

    //workout 수정
    @PutMapping("/{yearMonth}/{workoutSessionId}/{workoutId}")
    public Map<String,String> modify(@PathVariable(name = "workoutId") Integer workoutId, @RequestBody WorkoutDTO workoutDTO){
        workoutDTO.setWorkoutId(workoutId);
        log.info("Modify: "+workoutDTO);
        service.modify(workoutDTO);
        return Map.of("RESULT","SUCCESS");
    }

    //workout 삭제
    @DeleteMapping("/{yearMonth}/{workoutSessionId}/{workoutId}")
    public Map<String,String> remove(@PathVariable(name="workoutId")Integer workoutId){
        log.info("Remove: "+workoutId);
        service.remove(workoutId);
        return Map.of("RESULT","SUCCESS");
    }
}

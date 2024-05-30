package com.dg.deukgeun.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.WorkoutDTO;
import com.dg.deukgeun.service.WorkoutService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/workout")
public class WorkoutController {
    private final WorkoutService service;

    @GetMapping("/{workoutId}")
    public WorkoutDTO get(@PathVariable(name="workoutId") Integer workoutId){
        return service.get(workoutId);
    }
}

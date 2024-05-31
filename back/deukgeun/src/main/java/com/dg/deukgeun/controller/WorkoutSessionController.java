package com.dg.deukgeun.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.service.WorkoutSessionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/workoutSession")
public class WorkoutSessionController {
    private final WorkoutSessionService service;

    @GetMapping("/{workoutSessionId}")
    public WorkoutSessionDTO get(@PathVariable(name="workoutSessionId") Integer workoutSessionId){
        return service.get(workoutSessionId);
    }
}

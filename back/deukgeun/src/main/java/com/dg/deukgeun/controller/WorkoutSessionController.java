package com.dg.deukgeun.controller;

import java.time.LocalDate;
import java.util.List;

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

    // @GetMapping("/{workoutSessionId}")
    // public WorkoutSessionDTO get(@PathVariable(name="workoutSessionId") Integer workoutSessionId){
    //     return service.get(workoutSessionId);
    // }
    

    // 운동일지 페이지에서 yyyy-mm 문자열 형태로 입력을 받으면, 그달 1일 부터 말일까지 workout_session 테이블 정보를 arrayList 형태로 출력한다.
    @GetMapping("/{yearMonth}")
    public List<WorkoutSessionDTO> get(@PathVariable(name="yearMonth") String yearMonth){
        LocalDate startDate = LocalDate.parse(yearMonth+"-01");
        LocalDate endDate = startDate.plusMonths(1);
        
        return service.get(startDate, endDate);
    }
    // @GetMapping("/{yearMonth}/{workoutSessionId}")

}

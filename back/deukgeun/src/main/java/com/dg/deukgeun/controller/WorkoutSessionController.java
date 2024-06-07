package com.dg.deukgeun.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.WorkoutDTO;
import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.entity.WorkoutSessionRequest;
import com.dg.deukgeun.service.WorkoutService;
import com.dg.deukgeun.service.WorkoutSessionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/workoutSession")
public class WorkoutSessionController {
    private final WorkoutSessionService service;
    private final WorkoutService workoutService;

    // @GetMapping("/{workoutSessionId}")
    // public WorkoutSessionDTO get(@PathVariable(name="workoutSessionId") Integer
    // workoutSessionId){
    // return service.get(workoutSessionId);
    // }

    // 운동일지 페이지에서 yyyy-mm 문자열 형태로 입력을 받으면, 그달 1일 부터 말일까지 workout_session 테이블 정보를
    // arrayList 형태로 출력한다.
    @GetMapping("/{yearMonth}/{userId}")
    public List<WorkoutSessionDTO> get(@PathVariable(name = "yearMonth") String yearMonth, @PathVariable(name="userId") Integer userId) {
        LocalDate startDate = LocalDate.parse(yearMonth + "-01");
        LocalDate endDate = startDate.plusMonths(2);
        startDate = startDate.minusMonths(1);

        return service.get(userId,startDate, endDate);
    }

    /*
     * 데이터를 다음과 같이 받았다고 가정
     * 
     * {
     * //... workout_session에 들어갈 추가 정보
     * "workoutDate" : "2024-05-29",
     * "content" : "3대 운동",
     * //workout_session에 들어갈 추가 정보...
     * "workout" : [
     * {"workoutName" : "벤치프레스", "workoutSet" : "5", "workoutRep" : "5"},
     * {"workoutName" : "데드리프트", "workoutSet" : "5", "workoutRep" : "5"},
     * {"workoutName" : "스쿼트", "workoutSet" : "5", "workoutRep" : "5"}
     * ]
     * }
     * 아래 메서드는 위와 같은 형태의 Json 파일을 WorkoutSessionRequest로 받는다.
     * WorkoutSessionRequest에서 WorkoutSessionDTO, WorkoutDTO로 정보를 나눠준다.
     * 나눠받은 정보는 WorkoutSessionService, WorkoutService를 거쳐서 db로 저장된다.
     */
    @PostMapping("/register")
    public Map<String, Integer> register(@RequestBody WorkoutSessionRequest workoutSessionRequest) {
        log.info(workoutSessionRequest);
        WorkoutSessionDTO workoutSessionDTO = new WorkoutSessionDTO();
        workoutSessionDTO.setBodyWeight(workoutSessionRequest.getBodyWeight());
        workoutSessionDTO.setContent(workoutSessionRequest.getContent());
        workoutSessionDTO.setMemo(workoutSessionRequest.getMemo());
        workoutSessionDTO.setPtSessionId(workoutSessionRequest.getPtSessionId());
        workoutSessionDTO.setUserId(workoutSessionRequest.getUserId());
        workoutSessionDTO.setWorkoutDate(workoutSessionRequest.getWorkoutDate());
        workoutSessionDTO.setPtSessionId(workoutSessionRequest.getPtSessionId());
        workoutSessionDTO.setStartTime(workoutSessionRequest.getStartTime());
        workoutSessionDTO.setEndTime(workoutSessionRequest.getEndTime());

        Integer workoutSessionId = service.register(workoutSessionDTO);

        List<WorkoutDTO> workoutList = workoutSessionRequest.getWorkouts();
        for (int i = 0; i < workoutList.size(); i++) {
            workoutList.get(i).setWorkoutSessionId(workoutSessionId);
        }
        workoutService.insertList(workoutList);

        return Map.of("workoutSessionId", workoutSessionId);
    }

    // workoutSession 수정
    @PutMapping("/{workoutSessionId}")
    public Map<String, String> modify(@PathVariable(name = "workoutSessionId") Integer workoutSessionId,
            @RequestBody WorkoutSessionDTO workoutSessionDTO) {
        workoutSessionDTO.setWorkoutSessionId(workoutSessionId);
        log.info("Modify: " + workoutSessionDTO);
        service.modify(workoutSessionDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    // workoutSession 삭제
    @DeleteMapping("/{workoutSessionId}")
    public Map<String, String> remove(@PathVariable(name = "workoutSessionId") Integer workoutSessionId) {
        log.info("Remove: " + workoutSessionId);
        service.remove(workoutSessionId);
        return Map.of("RESULT", "SUCCESS");
    }
}

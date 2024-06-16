package com.dg.deukgeun.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
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
import com.dg.deukgeun.dto.WorkoutSessionReqeustDTO;
import com.dg.deukgeun.entity.WorkoutSessionRequest;
import com.dg.deukgeun.security.CustomUserDetails;
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
    @GetMapping("/get/{startDate}/{endDate}")
    public List<WorkoutSessionDTO> get(@PathVariable(name = "startDate") String startDate,
            @PathVariable(name = "endDate") String endDate) {
        log.info("startDate: " + startDate);
        log.info("endDate: " + endDate);
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        // String[] days = yearMonth.split("-");
        // Integer year = Integer.parseInt(days[0]);
        // Integer month = Integer.parseInt(days[1]);
        // LocalDate startDate = LocalDate.of(year, month, 1);
        // // LocalDate startDate = LocalDate.parse(yearMonth + "-01");
        // LocalDate endDate = startDate.plusMonths(2);
        // startDate = startDate.minusMonths(1);

        // log.info("startDate: " + startDate);
        // log.info("endDate: " + endDate);
        return service.get(userId, LocalDate.parse(startDate), LocalDate.parse(endDate));
    }

    // workoutSession은 불러왔으니, 어떤 workoutSession을 클릭하면, 그 Id 정보를 가지고 있는 workout만 따로
    // 불러옴 미리 부른 workoutSession + 지금 부른 workout으로 우측 form 박스를 채워주시면 됩니다.
    @GetMapping("/get/workouts/{workoutSessionId}")
    public List<WorkoutDTO> getMethodName(@PathVariable(name = "workoutSessionId") String workoutSessionId) {
        return workoutService.getByWorkoutSessionId(Integer.parseInt(workoutSessionId));
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
        workoutSessionDTO.setWorkoutDate(workoutSessionRequest.getWorkoutDate());
        workoutSessionDTO.setStartTime(workoutSessionRequest.getStartTime());
        workoutSessionDTO.setEndTime(workoutSessionRequest.getEndTime());

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        workoutSessionDTO.setUserId(userDetails.getUserId());

        Integer workoutSessionId = service.register(workoutSessionDTO);

        List<WorkoutDTO> workoutList = workoutSessionRequest.getWorkouts();
        for (int i = 0; i < workoutList.size(); i++) {
            workoutList.get(i).setWorkoutSessionId(workoutSessionId);
        }
        workoutService.insertList(workoutList);

        return Map.of("workoutSessionId", workoutSessionId);
    }

    // workoutSession 수정
    /*
     * 프론트에서 다음과 같이 데이터를 받아서 workoutSession을 수정 (형태는 formdata 혹은 Json)
     * mapping value로 workoutSessionId
     * {
     * ptSessionId : Integer,
     * workoutDate : Date,
     * content : String,
     * bodyWeight : Double,
     * memo : String,
     * startTime : Time,
     * endTime Time,
     * workout : [
     * {workoutName, workoutSet, workoutRep, workoutWeight},
     * {workoutName, workoutSet, workoutRep, workoutWeight},
     * {workoutName, workoutSet, workoutRep, workoutWeight},...
     * ]
     * }
     * 
     * workoutSession은 workoutSessionId를 기준으로 값을 수정하면 됨
     * workout의 경우 workoutSessionId를 가지고 있는 모든 workout을 삭제하고, 입력받은 workout으로 새로
     * create.
     * userId의 경우, workoutSessionId가 PK로서 고유성을 보장하므로, 입력받지 않는 것이 security가 좋을듯. 수정하는
     * 단계라면 이미 저장되어 있기도 하고.
     */
    @PutMapping("/modify/{workoutSessionId}")
    public Map<String, String> modify(@PathVariable(name = "workoutSessionId") Integer workoutSessionId,
            @RequestBody WorkoutSessionReqeustDTO workoutSessionReqeustDTO) {

        WorkoutSessionDTO workoutSessionDTO = new WorkoutSessionDTO();
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        workoutSessionDTO.setUserId(userDetails.getUserId());
        workoutSessionDTO.setWorkoutSessionId(workoutSessionId);
        workoutSessionDTO.setBodyWeight(workoutSessionReqeustDTO.getBodyWeight());
        workoutSessionDTO.setContent(workoutSessionReqeustDTO.getContent());
        workoutSessionDTO.setEndTime(workoutSessionReqeustDTO.getEndTime());
        workoutSessionDTO.setMemo(workoutSessionReqeustDTO.getMemo());
        workoutSessionDTO.setPtSessionId(workoutSessionReqeustDTO.getPtSessionId());
        workoutSessionDTO.setStartTime(workoutSessionReqeustDTO.getStartTime());
        workoutSessionDTO.setWorkoutDate(workoutSessionReqeustDTO.getWorkoutDate());

        System.out.println("Modify: " + workoutSessionDTO);
        service.modify(workoutSessionDTO);

        // workoutService.removeByWorkoutSessionId(workoutSessionId);
        // List<WorkoutDTO> workoutList = workoutSessionReqeustDTO.getWorkouts();
        // for (int i = 0; i < workoutList.size(); i++) {
        // workoutList.get(i).setWorkoutSessionId(workoutSessionId);
        // }
        // workoutService.insertList(workoutList);
        List<WorkoutDTO> workoutList = workoutSessionReqeustDTO.getWorkouts();
        System.out.println("Workout List: " + workoutList.toString());

        for (int i = 0; i < workoutList.size(); i++) {
            WorkoutDTO dto = workoutList.get(i);
            if (dto.getWorkoutSessionId() == null) {
                dto.setWorkoutSessionId(workoutSessionId);
                workoutService.register(dto);
            } else {
                workoutService.modify(dto);
            }

        }
        return Map.of("RESULT", "SUCCESS");
    }

    // workoutSession 삭제
    // workoutSession 만 삭제한다. workout의 경우 mysql 내부 트리거를 사용하면 자동으로 삭제되어 fk 의존성을 고려하지
    // 않아도 된다.
    /*
     * mysql 트리거 쿼리. 아래의 쿼리를 mysql 워크벤치에 입력하고 show triggers 로 잘 적용되었는 지 확인
     * delimiter $$
     * create trigger delete_workout
     * before delete on workout_session
     * for each row
     * begin
     * declare workoutSessionId_old int;
     * set workoutSessionId_old = old.workout_session_id;
     * delete from workout where workout_session_id = workoutSessionId_old;
     * end $$
     * delimiter ;
     */
    @DeleteMapping("/delete/{workoutSessionId}")
    public Map<String, String> remove(@PathVariable(name = "workoutSessionId") Integer workoutSessionId) {
        log.info("Remove: " + workoutSessionId);
        service.remove(workoutSessionId);
        return Map.of("RESULT", "SUCCESS");
    }
}

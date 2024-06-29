package com.dg.deukgeun.controller;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//작성자 : 허승돈
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.PtSessionDTO;
import com.dg.deukgeun.dto.PtSessionResponseDTO;
import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.PersonalTrainingService;
import com.dg.deukgeun.service.PtSessionService;
import com.dg.deukgeun.service.WorkoutSessionService;

import java.util.Map;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ptSession")
public class PtSessionController {
    private final PtSessionService ptSessionService;
    private final PersonalTrainingService personalTrainingService;
    private final WorkoutSessionService workoutSessionService;
    
    //pt 일정 등록
    /* pt 일정 등록을 위해 필요한 정보는 다음과 같다.
     * {
     *      ptId : personal_training 테이블의 pt_id.
     *      ptDate : yyyy-MM-dd 포멧의 LocalDate. pt를 실행하는 날짜
     *      startTime : HH:mm 포멧의 LocalTime. pt 시작시간.
     *      endTime : HH:mm 포멧. pt 끝시간.
     *      color : String. 6자리 색상 코드를 저장한다 (ex. ffffff:흰색, ff0000:빨간색)
     * }
     */
    /* pt 일정이 등록되는 순간
     * 1. pt_id를 참고하여 personal_training 테이블의 remain을 1 차감한다.
     * 2. personal_training의 유저 정보를 참고하여 workoutSession 에 입력된다.
     * 즉, 운동일지에 자동으로 작성된다. workout은 따로 입력한다.
    */
    // 프로토타입을 참고하여 제작하였습니다.
    // 현재 시간에 비교하여, 현재 시간이 starTime 보다 크다면, error와 에러코드 10001 리턴
    @PostMapping("/post")
    public Map<String,Integer> post(@RequestBody PtSessionDTO ptSessionDTO){
        if(ptSessionDTO.getPtDate().isBefore(LocalDate.now())){
            return Map.of("Error",10001);
        } else if (ptSessionDTO.getStartTime().isBefore(LocalTime.now())){
            return Map.of("Error",10002);
        }
        Integer ptSessionId = ptSessionService.insert(ptSessionDTO);
        
        personalTrainingService.update(ptSessionDTO.getPtId());
        
        PersonalTrainingDTO personalTrainingDTO = personalTrainingService.selectByptId(ptSessionDTO.getPtId());
        WorkoutSessionDTO workoutSessionDTO = new WorkoutSessionDTO();
        workoutSessionDTO.setContent(personalTrainingDTO.getPtContent());
        workoutSessionDTO.setEndTime(ptSessionDTO.getEndTime());
        workoutSessionDTO.setPtSessionId(ptSessionId);
        workoutSessionDTO.setStartTime(ptSessionDTO.getStartTime());
        workoutSessionDTO.setUserId(personalTrainingDTO.getUserId());
        workoutSessionDTO.setWorkoutDate(ptSessionDTO.getPtDate());
        workoutSessionService.register(workoutSessionDTO);
        return Map.of("ptSessionId",ptSessionId);
    }
    //pt 일정 불러오기
    /* pt 일정을 불러오기 위해 필요한 정보 : startDate, endDate, format = yyyy-MM-dd
     * 리턴해주는 pt 일정 정보 포멧
     * {
     *      ptSessionList : [{ptSessionId, ptId, memo, ptDate, startTime,
     *          endTime, color},...],
     *      personalTrainingList : [{ptId, userId, trainerId, ptCountTotal,
     *          ptCountRemain, ptContent, userPtReason, membershipId},...]
     * }
     */
    // 화면에서 보여주는 캘린더의 시작일과 끝일 사이의 pt 일정 정보를 가져옵니다.
    // pt 정보를 보고있는 트레이너의 personalTraining 정보를 가져옵니다.
    @GetMapping("/get/{startDate}/{endDate}")
    public PtSessionResponseDTO get(@PathVariable(name="startDate") String startDate,
        @PathVariable(name="endDate") String endDate){
            PtSessionResponseDTO ptSessionResponseDTO = new PtSessionResponseDTO();
            
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Integer trainerId = userDetails.getUserId();
            
            List<PersonalTrainingDTO> personalTrainingList = personalTrainingService.selectByTrainer(trainerId);
            List<PtSessionDTO> ptSessionList = ptSessionService.selectFromStartTimeToEndTime(trainerId, startDate, endDate);
            ptSessionResponseDTO.setPersonalTrainingList(personalTrainingList);
            ptSessionResponseDTO.setPtSessionList(ptSessionList);
            return ptSessionResponseDTO;
        }

}

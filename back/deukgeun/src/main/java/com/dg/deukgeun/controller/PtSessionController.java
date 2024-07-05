package com.dg.deukgeun.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//작성자 : 허승돈
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.PtSessionDTO;
import com.dg.deukgeun.dto.PtSessionResponseDTO;
import com.dg.deukgeun.dto.WorkoutDTO;
import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;
import com.dg.deukgeun.repository.TrainerRepository;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.PersonalTrainingService;
import com.dg.deukgeun.service.PtSessionService;
import com.dg.deukgeun.service.WorkoutService;
import com.dg.deukgeun.service.WorkoutSessionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ptSession")
public class PtSessionController {
    private final PtSessionService ptSessionService;
    private final PersonalTrainingService personalTrainingService;
    private final WorkoutSessionService workoutSessionService;
    private final TrainerRepository trainerRepository;
    private final WorkoutService workoutService;

    // pt 일정 등록
    /**
     * pt 일정 등록을 위해 필요한 정보는 다음과 같다.
     * {
     * ptId : personal_training 테이블의 pt_id.
     * trainerId : pt를 하는 trainer의 userId (from trainer table)
     * ptDate : yyyy-MM-dd 포멧의 LocalDate. pt를 실행하는 날짜
     * startTime : HH:mm 포멧의 LocalTime. pt 시작시간.
     * endTime : HH:mm 포멧. pt 끝시간.
     * color : String. 6자리 색상 코드를 저장한다 (ex. ffffff:흰색, ff0000:빨간색)
     * }
     */
    @SuppressWarnings("null")
    /*
     * pt 일정이 등록되는 순간
     * 1. pt_id를 참고하여 personal_training 테이블의 remain을 1 차감한다.
     * 2. personal_training의 유저 정보를 참고하여 workoutSession 에 입력된다.
     * 즉, 운동일지에 자동으로 작성된다. workout은 따로 입력한다.
     */
    // 프로토타입을 참고하여 제작하였습니다.
    // 현재 시간에 비교하여, 현재 시간이 starTime 보다 크다면, error와 에러코드 10001 리턴
    @PostMapping("/post")
    public Map<String, Object> post(@RequestBody WorkoutSessionDTO workoutSessionDTO) {
        // if (ptSessionDTO.getPtDate().isBefore(LocalDate.now())) {
        // return Map.of("Error", 10001);
        // } else if (ptSessionDTO.getStartTime().isBefore(LocalTime.now())) {
        // return Map.of("Error", 10002);
        // }
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        // 로그인 된 아이디로 트레이너를 찾음
        workoutSessionDTO.getPtSession().setTrainer(trainerRepository.findByUser_UserId(userDetails.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Trainer was not found")));

        // 받아온 PT session에서 user 정보 꺼내서 PT 정보 저장
        workoutSessionDTO.getPtSession()
                .setPt(personalTrainingService.findPT(workoutSessionDTO.getPtSession().getPt().getUser().getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("User not found")));

        // 받아온 PT session을 저장
        Integer ptSessionId = ptSessionService.insert(workoutSessionDTO.getPtSession());

        // 등록시 횟수 차감
        personalTrainingService.update(workoutSessionDTO.getPtSession().getPt().getPtId());

        // PT session에 있는 userId를 workoutSessionDTO id 로 저장
        workoutSessionDTO.setUserId(workoutSessionDTO.getPtSession().getPt().getUser().getUserId());

        // 저장한 PT session의 ID를 DTO에 저장
        workoutSessionDTO.getPtSession().setPtSessionId(ptSessionId);

        // DTO를 디비에 저장
        Integer workoutSessionId = workoutSessionService.register(workoutSessionDTO);

        // Workout List
        List<WorkoutDTO> workoutList = workoutSessionDTO.getWorkouts();
        for (int i = 0; i < workoutList.size(); i++) {
            workoutList.get(i).setWorkoutSessionId(workoutSessionId);
        }
        workoutService.insertList(workoutList);

        // personalTrainingService.update(ptSessionDTO.getPtId());

        // PersonalTrainingDTO personalTrainingDTO =
        // personalTrainingService.selectByptId(ptSessionDTO.getPtId());
        // WorkoutSessionDTO workoutSessionDTO = new WorkoutSessionDTO();
        // workoutSessionDTO.setContent(personalTrainingDTO.getPtContent());
        // workoutSessionDTO.setEndTime(ptSessionDTO.getEndTime());
        // workoutSessionDTO.getPtSession().setPtSessionId(ptSessionId);
        // workoutSessionDTO.setStartTime(ptSessionDTO.getStartTime());
        // workoutSessionDTO.getUser().setUserId(personalTrainingDTO.getUserId());
        // workoutSessionDTO.setWorkoutDate(ptSessionDTO.getPtDate());
        // workoutSessionService.register(workoutSessionDTO);

        return Map.of("workoutSessionId", workoutSessionId, "ptSession", workoutSessionDTO.getPtSession());
    }

    // pt 일정 불러오기
    /**
     * pt 일정을 불러오기 위해 필요한 정보 : startDate, endDate, format = yyyy-MM-dd
     * 리턴해주는 pt 일정 정보 포멧
     * {
     * ptSessionList : [{ptSessionId, ptId, trainerId, memo, ptDate, startTime,
     * endTime, color},...],
     * personalTrainingList : [{ptId, userId, trainerId, ptCountTotal,
     * ptCountRemain, ptContent, userPtReason, membershipId},...]
     * }
     */
    // 화면에서 보여주는 캘린더의 시작일과 끝일 사이의 pt 일정 정보를 가져옵니다.
    // pt 정보를 보고있는 트레이너의 personalTraining 정보를 가져옵니다.
    @GetMapping("/get/{startDate}/{endDate}")
    public PtSessionResponseDTO get(@PathVariable(name = "startDate") String startDate,
            @PathVariable(name = "endDate") String endDate) {
        PtSessionResponseDTO ptSessionResponseDTO = new PtSessionResponseDTO();

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer trainerId = userDetails.getUserId();

        List<PersonalTrainingDTO> personalTrainingList = personalTrainingService.selectByTrainer(trainerId);
        List<PtSessionDTO> ptSessionList = ptSessionService.findPTSession(trainerId);
        ptSessionResponseDTO.setPersonalTrainingList(personalTrainingList);
        ptSessionResponseDTO.setPtSessionList(ptSessionList);
        return ptSessionResponseDTO;
    }

    // pt 캘린더 일정 수정
    /**
     * 일정 정보 수정을 위해 다음과 같은 정보를 파라미터로 받는다.
     * {
     * ptId : Integer. personal_training 테이블의 FK
     * trainerId : Integer, trainer의 userId
     * memo : String : 트레이너가 직접 입력한 메모 string
     * ptDate : yyyy-MM-dd 포멧의 날짜 정보
     * startTime : HH:mm 포멧의 LocalTime. pt 시작시간.
     * endTime : HH:mm 포멧. pt 끝시간.
     * color : String. 6자리 색상 코드를 저장한다 (ex. ffffff:흰색, ff0000:빨간색)
     * }
     * // ptsession의 수정 정보가 적용되면, workoutSession 테이블의 일정도 수정한다.
     */
    @PutMapping("/put/{ptSessionId}")
    public Map<String, String> put(@PathVariable(name = "ptSessionId") Integer ptSessionId,
            @RequestBody PtSessionDTO ptSessionDTO) {
        ptSessionDTO.setPtSessionId(ptSessionId);
        ptSessionService.update(ptSessionDTO);
        workoutSessionService.updateByPtSession(ptSessionDTO);

        return Map.of("RESULT", "SUCCESS");
    }

    // pt 캘린더 일정 삭제
    // pt 에서 일정을 삭제시, personalTraining 에서 remain +1, workoutSession 일정도 삭제
    @DeleteMapping("/delete/{ptSessionId}")
    public Map<String, String> delete(@PathVariable(name = "ptSessionId") Integer ptSessionId) {
        PtSessionDTO ptSessionDTO = ptSessionService.selectById(ptSessionId);
        ptSessionService.delete(ptSessionId);
        personalTrainingService.plusRemain(ptSessionDTO.getPtId());
        workoutSessionService.deleteByPtSession(ptSessionId);

        return Map.of("RESULT", "SUCESS");
    }

    @GetMapping("/getPtSession")
    public List<WorkoutSessionDTO> getPtSessionForCurrentUser() {
        // Retrieve the current user's ID from security context
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();

        // Fetch WorkoutSessionDTO objects directly from PtSessionService
        List<WorkoutSessionDTO> workoutSessionDTOs = ptSessionService.getPtSession(userId);

        // Return WorkoutSessionDTO objects
        return workoutSessionDTOs;
    }

}

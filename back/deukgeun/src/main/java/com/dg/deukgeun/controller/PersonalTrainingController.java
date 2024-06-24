package com.dg.deukgeun.controller;
//작성자 : 허승돈

import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.gym.TrainerDTO;
import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.PersonalTrainingService;
import com.dg.deukgeun.service.TrainerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/personalTraining")
public class PersonalTrainingController {
    private final PersonalTrainingService service;
    private final TrainerService trainerService;

    //마찬가지로 매핑 타입에 따라 구분하기 쉽도록 메서드 이름을 짓겠습니다.

    //트레이너가 자신의 pt 목록을 확인하는 경우
    //trainerId = userId 이므로, get mapping으로 직접 호출 시 정보 노출의 위험이 있음
    //일단은 front에서 trainerId를 Json 또는 formdata 포멧으로 전송했을 때라고 생각하고 코딩하겠습니다.
    //현재 아래 구현 내용은 조금 천천히 다뤄야 할 듯 싶습니다. pt 등록 페이지 먼저 구현을 할게요.
    // @GetMapping("/trainer/get")
    // public List<PersonalTrainingDTO> getByTrainer(@RequestBody Integer trainerId){
    //     return service.selectByTrainer(trainerId);
    // }
    // //사용자가 자신이 등록한 pt 목록을 확인하는 경우
    // @GetMapping("/user/get")
    // public List<PersonalTrainingDTO> getByUser(@RequestBody Integer userId){
    //     return service.selectByUser(userId);
    // }

    //pt 등록 페이지가 controller에 줘야되는 정보
    /*
     * gymId : 내가 지금 등록하려는 gym정보가 필요함 gymId를 이용해서 트레이너 이름 정보를 가져와야됨
     */
    //pt 등록 페이지에 로드해야될 정보
    /*
     * 트레이너 이름(userName) : gymId를 활용해서 트레이너 이름들을 가져옴.
     * pt 등록 페이지의 경우 프론트에서는 트레이너  이름을 가지고
     * 누구에게 pt를 받을 지 정해지므로 트레이너 이름을 불러올 필요가 있음 
     */
    @GetMapping("/get/{gymId}")
    public List<TrainerDTO> getTrainerName(@PathVariable(name="gymId") Integer gymId){
        return trainerService.getList(gymId);
    }

    //pt 등록 기능
    //pt 등록 기능은 프론트에서 다음과 같은 정보를 받는다.
    /*
     * trainerId : 트레이너 아이디 (Integer)
     * regDate : 시작일 (LocalDate)
     * expDate : 끝일 (LocalDate)
     * ptCountTotal : 피티 횟수 (Integer)
     * ptCountRemain : 남은 횟수 (Integer)
     * ptContent : 운동 컨텐츠 (String)
     * userPtReason : 피티사유 (String)
     * userGender : 성별 (Integer)
     * userAge : 나이 (Integer)
     * userWorkoutDur :운동경력 (String)
     */
    // userId 는 CustomUserDetails를 사용해서 접근
    // postman에서 작동 확인은 완료했으나, CustomUserDetails에 대한 테스트 필요.
    @PostMapping("/post")
    public Map<String,Integer> post(@RequestBody PersonalTrainingDTO personalTrainingDTO){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = userDetails.getUserId();
        personalTrainingDTO.setUserId(userId);
        return Map.of("ptId",service.insert(personalTrainingDTO));
    }

}

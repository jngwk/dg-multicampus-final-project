package com.dg.deukgeun.controller;
//작성자 : 허승돈

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;
import com.dg.deukgeun.service.PersonalTrainingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/personalTraining")
public class PersonalTrainingController {
    private final PersonalTrainingService service;

    //마찬가지로 매핑 타입에 따라 구분하기 쉽도록 메서드 이름을 짓겠습니다.

    //트레이너가 자신의 pt 목록을 확인하는 경우
    //trainerId = userId 이므로, get mapping으로 직접 호출 시 정보 노출의 위험이 있음
    //일단은 front에서 trainerId를 Json 또는 formdata 포멧으로 전송했을 때라고 생각하고 코딩하겠습니다.
    @GetMapping("/trainer/get")
    public List<PersonalTrainingDTO> getByTrainer(@RequestBody Integer trainerId){
        return service.selectByTrainer(trainerId);
    }
    //사용자가 자신이 등록한 pt 목록을 확인하는 경우
    @GetMapping("/user/get")
    public List<PersonalTrainingDTO> getByUser(@RequestBody Integer userId){
        return service.selectByUser(userId);
    }

}

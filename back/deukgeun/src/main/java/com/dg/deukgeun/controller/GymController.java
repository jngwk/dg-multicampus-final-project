package com.dg.deukgeun.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.api.CRNumberCheckApi;
import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.service.GymService;

@RestController
@RequestMapping("/api/gym")
public class GymController {

    @Autowired
    private GymService gymService;

    // GYM 회원가입
    @PostMapping("/signUp")
    public ResponseDTO<?> registerGym(@RequestBody GymSignUpDTO requestBody) {
        ResponseDTO<?> result = gymService.signUp(requestBody);
        return result;
    }

    //사업자등록번호 확인
    @PostMapping("/crNumberCheck")
    public ResponseDTO<?> crNumberCheck(@RequestBody GymSignUpDTO requestBody){
        try{
            if(!CRNumberCheckApi.check(requestBody.getCrNumber()).equals("01")){
                return ResponseDTO.setFailed("해당 사업자 등록 번호는 휴업중이거나, 폐업한 번호입니다. 번호를 확인해 주세요.");
            } else
            {
                return ResponseDTO.setSuccess("올바른 사업자등록번호 입니다.");
            }
        } catch(Exception e){
            return ResponseDTO.setFailed("사업자 정보를 불러오는 것에 실패했습니다. 번호를 확인해 주세요.");
        }
    }

    // // GYM 로그인
    // @PostMapping("/login")
    // public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
    //     ResponseDTO<?> result = gymService.login(requestBody);
    //     return result;
    // }
}

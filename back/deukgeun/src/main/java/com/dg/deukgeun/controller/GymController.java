package com.dg.deukgeun.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.api.CRNumberCheckApi;
import com.dg.deukgeun.dto.gym.GymDTO;
import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.gym.GymRequestDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.service.GymService;
import com.dg.deukgeun.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gym")
@Log4j2
public class GymController {
    private final CustomFileUtil fileUtil;
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

    // GYM 로그인
    @PostMapping("/login")
    public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
        ResponseDTO<?> result = gymService.login(requestBody);
        return result;
    }

    //from gachudon brench
    //체육관 정보 불러오기
    @GetMapping("/{gymId}")
    public GymDTO get(@PathVariable("name = gymId") Integer gymId){
        return gymService.get(gymId);
    }

    /*
     * 다음과 같은 형태로 Json 포멧을 넘겨받았을 때를 가정
     * {
     *  userId : Integer
     *  gymName : String,
     *  crNumber : String,
     *  phoneNumber : String,
     *  address : String,
     *  detailAddress : String,
     *  operatingHours : ?,
     *  prices : ?,
     *  introduce : String,
     *  approval : 0 or 1 or 2 or... I don't know...,
     *  files : file array format
     * }
     * 
     * Json 포멧에 맞게 Entity를 만들고 IO가 잘 이루어지는 지 확인할 것
     * operatingHour, prices의 경우 파일로 받을 지, string으로 받을 지 모름. String 포멧으로 받고 논의 후 결정
     */

    @PostMapping("/")
    public Map<String,String> register(GymRequestDTO gymRequestDTO){
        log.info("register: " + gymRequestDTO);
        List<MultipartFile> files = gymRequestDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFile(files);
        gymRequestDTO.setUploadFileName(uploadFileNames);
        log.info(uploadFileNames);
        return Map.of("RESULT","SUCCESS");
    }
    //gachudon brench end
}

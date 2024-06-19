package com.dg.deukgeun.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.api.CRNumberCheckApi;
import com.dg.deukgeun.dto.gym.GymDTO;
import com.dg.deukgeun.dto.gym.GymImageDTO;
import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.gym.GymRequestDTO;
import com.dg.deukgeun.dto.gym.GymResponseDTO;
import com.dg.deukgeun.dto.user.LoginDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.GymImage;
import com.dg.deukgeun.service.GymImageService;
import com.dg.deukgeun.service.GymService;
import com.dg.deukgeun.service.TrainerService;
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
    @Autowired
    private GymImageService gymImageService;
    @Autowired
    private TrainerService trainerService;

    // GYM 회원가입
    @PostMapping("/signUp")
    public ResponseDTO<?> registerGym(@RequestBody GymSignUpDTO requestBody) {
        ResponseDTO<?> result = gymService.signUp(requestBody);
        return result;
    }

    // 사업자등록번호 확인
    @PostMapping("/crNumberCheck")
    public ResponseDTO<?> crNumberCheck(@RequestBody GymSignUpDTO requestBody) {
        try {
            if (!CRNumberCheckApi.check(requestBody.getCrNumber()).equals("01")) {
                return ResponseDTO.setFailed("해당 사업자 등록 번호는 휴업중이거나, 폐업한 번호입니다. 번호를 확인해 주세요.");
            } else {
                return ResponseDTO.setSuccess("올바른 사업자등록번호 입니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("사업자 정보를 불러오는 것에 실패했습니다. 번호를 확인해 주세요.");
        }
    }

    // from gachudon brench
    // 체육관 정보 불러오기
    /*
     * 아래의 메서드는 체육관 정보를 불러오는 메서드로, react에게 다음과 같은 정보를 전달함:
     * address : 헬스장 주소
     * Approval
     * crNumber : 헬스장 사업자등록번호
     * detailAddress : 헬스장 상세주소 (건물이름 등)
     * GymId
     * GymName : 헬스장 이름
     * introduce : 헬스장 소개
     * OperatingHours : 헬스장 운영시간
     * PhonNumber : 헬스장/헬스장 대표자 전화번호
     * Prices : 등록/pt 가격 등 등록비용
     * UploadFileName : 헬스장 이미지 List,
     * * 이미지 이름만 불러올 뿐 이미지 자체를 불러오진 않으므로,
     * 미리 약속된 이미지 경로를 프론트에서 호출할 것.
     * UserId : 헬스장 주인 아이디
     * trainersList : {
     *  trainerId : 트레이너 Id. userId 와 동일
     *  trainerCareer : 트레이너 커리어
     *  trainerImage : 트레이너 사진
     *  gymId : 트레이너 소속의 gym Id
     *  userName : 트레이너 이름
     * }
     *
     */
    @GetMapping("/get/{gymId}")
    public GymResponseDTO get(@PathVariable Integer gymId) {
        GymDTO gymDTO = gymService.get(gymId);
        List<GymImageDTO> gymImageDTOList = gymImageService.getByGymId(gymId);
        List<String> fileNames = new ArrayList<>();
        for (int i = 0; i < gymImageDTOList.size(); i++) {
            fileNames.add(gymImageDTOList.get(i).getGymImage());
        }
        GymResponseDTO gymResponseDTO = new GymResponseDTO();
        gymResponseDTO.setAddress(gymDTO.getAddress());
        // gymResponseDTO.setApproval(gymDTO.getApproval());
        gymResponseDTO.setCrNumber(gymDTO.getCrNumber());
        gymResponseDTO.setDetailAddress(gymDTO.getDetailAddress());
        gymResponseDTO.setGymId(gymDTO.getGymId());
        gymResponseDTO.setGymName(gymDTO.getGymName());
        gymResponseDTO.setIntroduce(gymDTO.getIntroduce());
        gymResponseDTO.setOperatingHours(gymDTO.getOperatingHours());
        gymResponseDTO.setPhoneNumber(gymDTO.getPhoneNumber());
        gymResponseDTO.setPrices(gymDTO.getPrices());
        gymResponseDTO.setUploadFileName(fileNames);
        gymResponseDTO.setUserId(gymDTO.getUserId());
        log.info("before trainersCall");
        gymResponseDTO.setTrainersList(trainerService.getList(gymId));
        log.info("after trainersCall");
        return gymResponseDTO;
    }

    /*
     * 다음과 같은 형태로 Json/FormData 포멧을 넘겨받았을 때를 가정
     * {
     * userId : Integer
     * gymName : String,
     * crNumber : String,
     * phoneNumber : String,
     * address : String,
     * detailAddress : String,
     * operatingHours : ?,
     * prices : ?,
     * introduce : String,
     * approval : 0 or 1 or 2 or... I don't know...,
     * files : file array format
     * }
     * 
     * Json/FormData 포멧에 맞게 Entity를 만들고 IO가 잘 이루어지는 지 확인할 것
     * operatingHour, prices의 경우 파일로 받을 지, string으로 받을 지 모름. String 포멧으로 받고 논의 후 결정
     */

    @PostMapping("/post")
    public Map<String,String> register(GymRequestDTO gymRequestDTO){
        log.info("register: " + gymRequestDTO);
        List<MultipartFile> files = gymRequestDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFile(files);
        gymRequestDTO.setUploadFileName(uploadFileNames);
        log.info(uploadFileNames);

        GymDTO gymDTO = new GymDTO();
        gymDTO.setAddress(gymRequestDTO.getAddress());
        // gymDTO.setApproval(gymRequestDTO.getApproval());
        gymDTO.setCrNumber(gymRequestDTO.getCrNumber());
        gymDTO.setDetailAddress(gymRequestDTO.getDetailAddress());
        gymDTO.setGymName(gymRequestDTO.getGymName());
        gymDTO.setIntroduce(gymRequestDTO.getIntroduce());
        gymDTO.setOperatingHours(gymRequestDTO.getOperatingHours());
        gymDTO.setPhoneNumber(gymRequestDTO.getPhoneNumber());
        gymDTO.setPrices(gymRequestDTO.getPrices());
        gymDTO.setUserId(gymRequestDTO.getUserId());

        int gymId = gymService.insert(gymDTO);

        List<GymImageDTO> gymImageDTOList = new ArrayList<>();
        for (int i = 0; i < uploadFileNames.size(); i++) {
            gymImageDTOList.add(new GymImageDTO(uploadFileNames.get(i), gymId));
        }

        gymImageService.insertList(gymImageDTOList);

        return Map.of("RESULT", "SUCCESS");
    }

    /* 다음과 같은 형태로 Json/FormData 포멧을 넘겨받았을 때를 가정
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
     *  approval : 0 or 1 or 2 or... I don't know...
     * }
     * 파일은 받지 않는다.
     * 이미지 파일의 경우 수정 없이 삭제/추가만 기능하는 것으로 조정
     */
    @PutMapping("/put/{gymId}")
    public Map<String, String> modify(@PathVariable(name = "gymId")Integer gymId, @RequestBody GymRequestDTO gymRequestDTO){
        GymDTO gymDTO = new GymDTO();

        gymDTO.setAddress(gymRequestDTO.getAddress());
        // gymDTO.setApproval(gymRequestDTO.getApproval());
        gymDTO.setCrNumber(gymRequestDTO.getCrNumber());
        gymDTO.setDetailAddress(gymRequestDTO.getDetailAddress());
        gymDTO.setGymId(gymId);
        gymDTO.setGymName(gymRequestDTO.getGymName());
        gymDTO.setIntroduce(gymRequestDTO.getIntroduce());
        gymDTO.setOperatingHours(gymRequestDTO.getOperatingHours());
        gymDTO.setPhoneNumber(gymRequestDTO.getPhoneNumber());
        gymDTO.setPrices(gymRequestDTO.getPrices());
        
        log.info("Modify: " + gymDTO);
        gymService.modify(gymDTO);
        return Map.of("RESULT","SUCCESS");
    }

    @DeleteMapping("/delete/{gymId}")
    public Map<String,String> remove(@PathVariable(name = "gymId") Integer gymId){
        log.info("Remove: " + gymId);
        gymService.remove(gymId);
        return Map.of("RESULT", "SUCCESS");
    }

    //헬스장 이미지'만' 추가
    /* 입력 내용
     *  {
     *  files : file array format
     *  }
     *  gymId는 PathVariable로 받음
     */
    @PostMapping("/insertImage/{gymId}")
    public Map<String, String> insertImage(@PathVariable(name = "gymId")Integer gymId,@RequestBody GymRequestDTO gymRequestDTO){
        List<GymImageDTO> dtoList = new ArrayList<>();
        List<MultipartFile> files = gymRequestDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFile(files);
        for(int i=0;i<files.size();i++){
            GymImageDTO dto = new GymImageDTO();
            dto.setGymId(gymId);
            dto.setGymImage(uploadFileNames.get(i));
            dtoList.add(dto);
        }
        gymImageService.insertList(dtoList);
        return Map.of("RESULT","SUCESS");
    }

    //헬스장 이미지 삭제
    @DeleteMapping("/deleteImage/{gymImage}")
    public Map<String,String> removeImage(@PathVariable(name="gymImage") String gymImage){
        gymImageService.remove(gymImage);
        return Map.of("RESULT","SUCCESS");
    }

    //gachudon brench end

    // // GYM 로그인
    // @PostMapping("/login")
    // public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
    // ResponseDTO<?> result = gymService.login(requestBody);
    // return result;
    // }
}

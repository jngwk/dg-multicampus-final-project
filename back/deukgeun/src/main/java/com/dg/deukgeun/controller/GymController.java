package com.dg.deukgeun.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dg.deukgeun.api.CRNumberCheckApi;
import com.dg.deukgeun.dto.PageRequestDTO;
import com.dg.deukgeun.dto.PageResponseDTO;
import com.dg.deukgeun.dto.gym.GymDTO;
import com.dg.deukgeun.dto.gym.GymImageDTO;
import com.dg.deukgeun.dto.gym.GymRequestDTO;
import com.dg.deukgeun.dto.gym.GymResponseDTO;
import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.GymImageService;
import com.dg.deukgeun.service.GymService;
import com.dg.deukgeun.service.ProductService;
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
    @Autowired
    private ProductService productService;

    // // GYM 회원가입
    // @PostMapping("/signUp")
    // public ResponseDTO<?> registerGym(@RequestBody GymSignUpDTO requestBody) {
    // ResponseDTO<?> result = gymService.signUp(requestBody);
    // return result;
    // }

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

    @PostMapping("/crNumberCheck/duplicate")
    public Boolean crNumberDuplicateCheck(@RequestBody GymSignUpDTO requestBody) {
        return gymService.crNumberDuplicateCheck(requestBody.getCrNumber());
    }

    // 페이징 처리한 헬스장 데이터 목록 불러오기
    /*
     * 불러오는 데이터 포멧은 다음과 같습니다.
     * {
     * "dtoList": [
     * {
     * "gymId": 1,
     * "gymName": null,
     * "userId": 3,
     * "crNumber": null,
     * "phoneNumber": null,
     * "address": null,
     * "detailAddress": null,
     * "operatingHours": null,
     * "prices": null,
     * "introduce": null
     * }
     * ],
     * "pageNumList": [
     * 1
     * ],
     * "pageRequestDTO": {
     * "page": 1,
     * "size": 10
     * },
     * "prev": false,
     * "next": false,
     * "totalCount": 1,
     * "prevPage": 0,
     * "nextPage": 0,
     * "totalPage": 1,
     * "current": 1
     * }
     */
    @GetMapping("/getListWithPaging")
    public PageResponseDTO<GymDTO> list(PageRequestDTO pageRequestDTO) {
        return gymService.listWithPaging(pageRequestDTO);
    }

    @GetMapping("/getList")
    public List<Gym> list() {
        List<Gym> list = gymService.list();
        for (Gym gym : list) {
            gym.getUser().setPassword("");
        }
        // Map<String, Gym> responseMap = new HashMap<>();
        // if (list.size() > 0) {
        // for (Gym gym : list) {
        // responseMap.put(gym.getUser().getUserName(), gym);
        // }
        // }
        return list;

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
     * UploadFileName : 헬스장 이미지 List,
     * * 이미지 이름만 불러올 뿐 이미지 자체를 불러오진 않으므로,
     * 미리 약속된 이미지 경로를 프론트에서 호출할 것.
     * UserId : 헬스장 주인 아이디
     * trainersList : {
     * trainerId : 트레이너 Id. userId 와 동일
     * trainerCareer : 트레이너 커리어
     * trainerImage : 트레이너 사진
     * gymId : 트레이너 소속의 gym Id
     * userName : 트레이너 이름
     * }]
     * productList : [{
     * productId : 상품 아이디
     * price : 상품 가격
     * days : 상품 기간 (일수 예 : 30일, 60일 등)
     * productName : 상품명
     * ptCountTotal : pt일 경우 상품이 제공하는 pt 횟수
     * }]
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
        gymResponseDTO.setUploadFileName(fileNames);
        gymResponseDTO.setUserId(gymDTO.getUserId());
        gymResponseDTO.setUserName(gymDTO.getUserName());
        gymResponseDTO.setSNSLink(gymDTO.getSNSLink());
        gymResponseDTO.setTrainersList(trainerService.getList(gymId));
        gymResponseDTO.setProductList(productService.getList(gymId));
        return gymResponseDTO;
    }

    // userId로 gym 정보 가져오기
    @GetMapping("/getGymByUserId")
    public GymResponseDTO getGymByUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        GymDTO gymDTO = gymService.getGymByUserId(userId);
        List<GymImageDTO> gymImageDTOList = gymImageService.getByGymId(gymDTO.getGymId());
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
        gymResponseDTO.setUploadFileName(fileNames);
        gymResponseDTO.setUserId(gymDTO.getUserId());
        gymResponseDTO.setUserName(gymDTO.getUserName());
        gymResponseDTO.setSNSLink(gymDTO.getSNSLink());
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
     * introduce : String,
     * approval : 0 or 1 or 2 or... I don't know...,
     * files : file array format
     * productList : [{
     * productId : 상품 아이디
     * price : 상품 가격
     * days : 상품 기간 (일수 예 : 30일, 60일 등)
     * productName : 상품명
     * ptCountTotal : pt일 경우 상품이 제공하는 pt 횟수
     * }]
     * }
     * 
     * Json/FormData 포멧에 맞게 Entity를 만들고 IO가 잘 이루어지는 지 확인할 것
     * operatingHour, prices의 경우 파일로 받을 지, string으로 받을 지 모름. String 포멧으로 받고 논의 후 결정
     */

    @PostMapping("/post")
    public Map<String, String> register(GymRequestDTO gymRequestDTO) {
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
        gymDTO.setUserId(gymRequestDTO.getUserId());
        gymDTO.setUserName(gymRequestDTO.getUserName());
        gymDTO.setSNSLink(gymRequestDTO.getSNSLink());

        int gymId = gymService.insert(gymDTO);

        List<GymImageDTO> gymImageDTOList = new ArrayList<>();
        for (int i = 0; i < uploadFileNames.size(); i++) {
            gymImageDTOList.add(new GymImageDTO(uploadFileNames.get(i), gymId));
        }

        productService.insertList(gymRequestDTO.getProductList());

        gymImageService.insertList(gymImageDTOList);

        return Map.of("RESULT", "SUCCESS");
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
     * introduce : String,
     * productList : [{
     * productId : Integer,
     * gymId : Integer,
     * days : Integer,
     * productName : String,
     * ptCountTotal : Integer, nullable
     * }]
     * }
     * 파일은 받지 않는다.
     * 이미지 파일의 경우 수정 없이 삭제/추가만 기능하는 것으로 조정
     * 상품 정보의 경우 입력받은 productList를 참고해서 같은 gymId의 모든 상품 정보를
     * 삭제하고, 다시 저장하는 형태로 저장.
     */
    @PutMapping("/put/{gymId}")
    public Map<String, String> modify(@PathVariable(name = "gymId") Integer gymId,
            @RequestBody GymRequestDTO gymRequestDTO) {
        GymDTO gymDTO = new GymDTO();
        gymDTO.setAddress(gymRequestDTO.getAddress());
        // gymDTO.setApproval(gymRequestDTO.getApproval());
        gymDTO.setCrNumber(gymRequestDTO.getCrNumber());
        gymDTO.setDetailAddress(gymRequestDTO.getDetailAddress());
        gymDTO.setGymId(gymId);
        gymDTO.setGymName(gymRequestDTO.getGymName());
        gymDTO.setUserName(gymRequestDTO.getUserName());
        gymDTO.setIntroduce(gymRequestDTO.getIntroduce());
        gymDTO.setOperatingHours(gymRequestDTO.getOperatingHours());
        gymDTO.setSNSLink(gymRequestDTO.getSNSLink());
        gymDTO.setPhoneNumber(gymRequestDTO.getPhoneNumber());
        gymDTO.setUserName(gymRequestDTO.getUserName());
        log.info("Modify: " + gymDTO);
        gymService.modify(gymDTO);
        productService.deleteProductByGymId(gymId);
        productService.insertList(gymRequestDTO.getProductList());
        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/delete/{gymId}")
    public Map<String, String> remove(@PathVariable(name = "gymId") Integer gymId) {
        log.info("Remove: " + gymId);
        gymService.remove(gymId);
        return Map.of("RESULT", "SUCCESS");
    }

    // 헬스장 이미지'만' 추가
    /*
     * 입력 내용
     * {
     * files : file array format
     * }
     * gymId는 PathVariable로 받음
     */
    @PostMapping("/insertImage/{gymId}")
    public Map<String, String> insertImage(@PathVariable(name = "gymId") Integer gymId,
            @RequestPart("files") List<MultipartFile> files) {
        List<GymImageDTO> dtoList = new ArrayList<>();
        List<String> uploadFileNames = fileUtil.saveFile(files);
        for (String fileName : uploadFileNames) {
            dtoList.add(new GymImageDTO(fileName, gymId));
        }
        gymImageService.insertList(dtoList);
        return Map.of("RESULT", "SUCCESS");
    }

    // 헬스장 이미지 삭제
    @DeleteMapping("/deleteImage/{gymImage}")
    public Map<String, String> removeImage(@PathVariable(name = "gymImage") String gymImage) {
        gymImageService.remove(gymImage);
        return Map.of("RESULT", "SUCCESS");
    }

    // gachudon brench end

    // // GYM 로그인
    // @PostMapping("/login")
    // public ResponseDTO<?> login(@RequestBody LoginDTO requestBody) {
    // ResponseDTO<?> result = gymService.login(requestBody);
    // return result;
    // }

    @GetMapping("/search")
    public List<Gym> searchGyms(
            @RequestParam(name = "searchWord") String searchWord,
            @RequestParam(name = "filter", defaultValue = "general") String filter,
            @RequestParam(name = "location", required = false) String location,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "100") int size) {

        Pageable pageable = PageRequest.of(page, size);

        switch (filter) {
            case "hours":
                return gymService.searchGymsByOperatingHours(searchWord);
            case "location":
                return gymService.searchGymsByLocation(searchWord, location);
            case "price":
                return gymService.searchGymsByPrice(searchWord, pageable);
            default:
                return gymService.searchGyms(searchWord);
        }
    }
}

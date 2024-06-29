package com.dg.deukgeun.controller;
//작성자 : 허승돈

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;
import com.dg.deukgeun.dto.personalTraining.PersonalTrainingRequestDTO;
import com.dg.deukgeun.dto.personalTraining.PersonalTrainingResponseDTO;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.MembershipService;
import com.dg.deukgeun.service.PersonalTrainingService;
import com.dg.deukgeun.service.ProductService;
import com.dg.deukgeun.service.TrainerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/personalTraining")
public class PersonalTrainingController {
    private final PersonalTrainingService service;
    private final TrainerService trainerService;
    private final ProductService productService;
    private final MembershipService membershipService;

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
     * 상품 명 및 상품 가격 (product.productName, product.price) : 사용자가 어떤 상품을 살 지 알아야 하기 때문에 가격과 이름 로드 필요 
     */
    //로드되는 정보
    /*
     * trainerList : [{
     *      trainerId, trainerCareer, ..., userName, ...
     * }],
     * productList : [{
     *      productId, productName, price...
     * }]
     */
    @GetMapping("/get/{gymId}")
    public PersonalTrainingResponseDTO getInformation(@PathVariable(name="gymId") Integer gymId){
        PersonalTrainingResponseDTO personalTrainingResponseDTO = new PersonalTrainingResponseDTO();
        personalTrainingResponseDTO.setTrainerList(trainerService.getList(gymId));
        personalTrainingResponseDTO.setProductList(productService.getList(gymId));
        return personalTrainingResponseDTO;
    }

    //pt 등록 기능
    //pt 등록 기능은 프론트에서 다음과 같은 정보를 받는다.
    /*
     * {
     *      membershipDTO : {
     *          gymId : pt를 받는 체육관 id,
     *          regDate : string으로 받음. 시작일,
     *          expDate : string으로 받음. 끝일,
     *          userGender : 성별
     *          userAge : 나이
     *          userWorkoutDuration : 사용자의 운동 경력
     *          productId : 신청한 상품 id
     *      }
     *      personalTrainingDTO : {
     *          trainerId : pt를 하는 트레이너 id,
     *          userPtReason : pt신청 사유
     *      }
     * }
    */
    // userId 는 CustomUserDetails를 사용해서 접근
    // postman에서 작동 확인은 완료했으나, CustomUserDetails에 대한 테스트 필요.
    @PostMapping("/post")
public ResponseEntity<?> post(@RequestBody PersonalTrainingRequestDTO requestDTO) {
    try {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = userDetails.getUserId();
        
        requestDTO.getPersonalTrainingDTO().setUserId(userId);
        requestDTO.getMembershipDTO().setUserMemberReason(requestDTO.getPersonalTrainingDTO().getUserPtReason());

        // Register both membership and PT
        Integer ptId = service.registerPersonalTraining(requestDTO, userId);
        
        return ResponseEntity.ok(Map.of("ptId", ptId));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("PT 등록에 실패했습니다.");
    }
}

    @GetMapping("/findPT")
    public ResponseEntity<?> checkPersonalTraining() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = userDetails.getUserId();

        Optional<PersonalTrainingDTO> pt = service.findPT(userId);

        if (pt.isPresent()) {
            return ResponseEntity.ok(pt.get());
        } else {
            return ResponseEntity.ok(null);
        }
    }
}

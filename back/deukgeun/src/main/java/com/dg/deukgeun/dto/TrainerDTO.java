package com.dg.deukgeun.dto;
// 허승돈이 만든 파일입니다.
/*
 * 본 DTO는 체육관의 정보를 불러올 때, 체육관 소속의 트레이너 이름, 트레이너 커리어, 트레이너 사진 정보를 불러올 수 있도록 만들어진 DTO 입니다.
 * 본 파일을 수정하시는 것은 문제가 없을 것으로 보이나, 수정하신 경우 오류 처리 등을 용이하게 하기 위해 이 주석 아래에 수정자 이름을 적어주시면 감사하겠습니다.
 * 수정자 : 허승돈
 * 수정자 : 
 */

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrainerDTO {
    //trainers 테이블에서 가져올 정보
    private Integer trainerId; // = users테이블의 userId
    private String trainerCareer;
    private String trainerImage;
    private Integer gymId;

    //user 테이블에서 가져올 정보
    private String userName;
    private String email;
}

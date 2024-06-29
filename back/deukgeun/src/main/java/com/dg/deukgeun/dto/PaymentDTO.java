package com.dg.deukgeun.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private String impUid; // 아임포트에서 발급한 결제 고유 번호
    private String merchantUid; // 가맹점에서 생성한 주문 번호
    private Integer amount; // 결제 금액
    private String status; // 결제 상태 (paid, failed 등)
    private String buyer_email;
    private String buyer_name;
    // 추가적으로 필요한 필드들을 필요에 따라 추가할 수 있습니다.
}
package com.dg.deukgeun.dto;
//작성자 : 허승돈
//수정자 : 허승돈

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Integer productId;
    private Integer gymId;
    private Integer price;
    private Integer days;
    private String productName;
    private Integer ptCountTotal;
}

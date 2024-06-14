package com.dg.deukgeun.dto.gym;
// written by Gachudon

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymImageDTO {
    private String gymImage;
    private Integer gymId;
}

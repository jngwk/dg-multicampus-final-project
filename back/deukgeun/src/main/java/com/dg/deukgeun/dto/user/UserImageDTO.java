package com.dg.deukgeun.dto.user;
// written by Gachudon

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserImageDTO {
    private String userImage;
    private Integer userId;
}
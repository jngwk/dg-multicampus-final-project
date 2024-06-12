package com.dg.deukgeun.dto.gym;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GymLoginResponseDTO {
    private String token;
    private int exprTime;
    private User user;
    private Gym gym;
}

package com.dg.deukgeun.dto.user;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GymLoginResponseDTO {
    private String token;
    private int exprTime;
    private User user;
    private Gym gym;
}

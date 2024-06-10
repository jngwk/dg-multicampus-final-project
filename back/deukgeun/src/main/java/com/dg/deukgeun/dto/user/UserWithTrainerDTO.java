package com.dg.deukgeun.dto.user;

import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWithTrainerDTO {
    private User user;
    private Trainer trainer;
}
package com.dg.deukgeun.dto.personalTraining;

import com.dg.deukgeun.dto.gym.MembershipDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalTrainingRequestDTO {
    MembershipDTO membershipDTO;
    PersonalTrainingDTO personalTrainingDTO;
}
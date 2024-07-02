package com.dg.deukgeun.dto;

import java.util.List;
import java.util.ArrayList;

import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PtSessionResponseDTO {
    @Builder.Default
    private List<PtSessionDTO> ptSessionList = new ArrayList<>();
    @Builder.Default
    private List<PersonalTrainingDTO> personalTrainingList = new ArrayList<>();
}

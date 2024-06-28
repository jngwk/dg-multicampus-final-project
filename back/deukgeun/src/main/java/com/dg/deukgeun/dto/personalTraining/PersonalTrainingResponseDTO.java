package com.dg.deukgeun.dto.personalTraining;

import java.util.List;
// import java.util.ArrayList;

import com.dg.deukgeun.dto.ProductDTO;
import com.dg.deukgeun.dto.gym.TrainerDTO;

import lombok.AllArgsConstructor;
// import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
// @Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalTrainingResponseDTO {
    // @Builder.Default
    private List<TrainerDTO> trainerList;
    private List<ProductDTO> productList;
}
package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.TrainerDTO;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.repository.TrainerRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class TrainerService {
    private final ModelMapper modelMapper;
    private final TrainerRepository trainerRepository;
    
    public List<TrainerDTO> getList(Integer gymId){
        List<Trainer> result = trainerRepository.findAllBygymGymId(gymId); 
        List<TrainerDTO> dtoList = new ArrayList<>();
        for(int i=0;i<result.size();i++){
            TrainerDTO dto = new TrainerDTO();
            dto.setGymId(gymId);
            dto.setTrainerCareer(result.get(i).getTrainerCareer());
            dto.setTrainerId(result.get(i).getTrainerId());
            dto.setTrainerImage(result.get(i).getTrainerImage());
            dto.setUserName(result.get(i).getUser().getUserName());
            dtoList.add(dto);
        }
        return dtoList;
    }
}

package com.dg.deukgeun.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.PtSessionDTO;
import com.dg.deukgeun.entity.PtSession;
import com.dg.deukgeun.repository.PtSessionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PtSessionService {
    private final ModelMapper modelMapper;
    private final PtSessionRepository ptSessionRepository;

    public Integer insert(PtSessionDTO ptSessionDTO){
        PtSession ptSession = modelMapper.map(ptSessionDTO, PtSession.class);
        PtSession savedPtSession = ptSessionRepository.save(ptSession);
        return savedPtSession.getPtSessionId();
    }

    public List<PtSessionDTO> selectFromStartTimeToEndTime(Integer trainerId,String startDate, String endDate){
        List<PtSession> ptSessionList = ptSessionRepository.findByTrainerIdAndptDateBetween(trainerId, LocalDate.parse(startDate), LocalDate.parse(endDate));
        List<PtSessionDTO> dtoList = new ArrayList<>();
        for(int i=0;i<ptSessionList.size();i++){
            dtoList.add(modelMapper.map(ptSessionList.get(i),PtSessionDTO.class));
        }
        return dtoList;
    }
}

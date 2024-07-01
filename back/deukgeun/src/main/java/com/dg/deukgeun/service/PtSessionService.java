package com.dg.deukgeun.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        List<PtSession> ptSessionList = ptSessionRepository.findByTrainerIdAndPtDateBetween(trainerId, LocalDate.parse(startDate), LocalDate.parse(endDate));
        List<PtSessionDTO> dtoList = new ArrayList<>();
        for(int i=0;i<ptSessionList.size();i++){
            dtoList.add(modelMapper.map(ptSessionList.get(i),PtSessionDTO.class));
        }
        return dtoList;
    }

    public PtSessionDTO selectById(Integer ptSessionId){
        Optional<PtSession> result = ptSessionRepository.findById(ptSessionId);
        PtSession ptSession = result.orElseThrow();

        PtSessionDTO ptSessionDTO = modelMapper.map(ptSession,PtSessionDTO.class);
        return ptSessionDTO;
    }

    public void update(PtSessionDTO ptSessionDTO){
        Optional<PtSession> result = ptSessionRepository.findById(ptSessionDTO.getPtSessionId());
        PtSession ptSession = result.orElseThrow();

        ptSession.setColor(ptSessionDTO.getColor());
        ptSession.setEndTime(ptSessionDTO.getEndTime());
        ptSession.setMemo(ptSessionDTO.getMemo());
        ptSession.setPtDate(ptSessionDTO.getPtDate());
        ptSession.setStartTime(ptSessionDTO.getStartTime());
        ptSessionRepository.save(ptSession);
    }

    public void delete(Integer ptSessionId){
        ptSessionRepository.deleteById(ptSessionId);
    }
}

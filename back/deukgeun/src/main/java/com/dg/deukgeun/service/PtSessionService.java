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

    public Integer insert(PtSession ptSession) {
        PtSession savedPtSession = ptSessionRepository.save(ptSession);
        return savedPtSession.getPtSessionId();
    }

    public List<PtSessionDTO> findPTSession(Integer trainerId) {
        List<PtSession> ptSessionList = ptSessionRepository.findByTrainer_TrainerId(trainerId);
        List<PtSessionDTO> dtoList = new ArrayList<>();
        for (int i = 0; i < ptSessionList.size(); i++) {
            dtoList.add(modelMapper.map(ptSessionList.get(i), PtSessionDTO.class));
        }
        return dtoList;
    }

    public PtSessionDTO selectById(Integer ptSessionId) {
        Optional<PtSession> result = ptSessionRepository.findById(ptSessionId);
        PtSession ptSession = result.orElseThrow();

        PtSessionDTO ptSessionDTO = modelMapper.map(ptSession, PtSessionDTO.class);
        return ptSessionDTO;
    }

    public void update(PtSessionDTO ptSessionDTO) {
        Optional<PtSession> result = ptSessionRepository.findById(ptSessionDTO.getPtSessionId());
        PtSession ptSession = result.orElseThrow();

        ptSessionRepository.save(ptSession);
    }

    public void delete(Integer ptSessionId) {
        ptSessionRepository.deleteById(ptSessionId);
    }
}

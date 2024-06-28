package com.dg.deukgeun.service;
//작성자 : 허승돈

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;
import com.dg.deukgeun.entity.PersonalTraining;
import com.dg.deukgeun.repository.PersonalTrainingRepository;
import com.dg.deukgeun.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
// import lombok.extern.log4j.Log4j2;

@Service
@Transactional
// @Log4j2
@RequiredArgsConstructor
public class PersonalTrainingService {
    private final ModelMapper modelMapper;
    private final PersonalTrainingRepository personalTrainingRepository;
    @Autowired
    UserRepository userRepository;

    //서비스를 구분하기 쉽도록 메서드의 이름은 각각 대응되는 mysql 쿼리 이름으로 적어두겠습니다.
    @PreAuthorize("(hasRole('ROLE_GENERAL')) && #userId == principal.userId")
    public Integer insert(PersonalTrainingDTO personalTrainingDTO){
        PersonalTraining personalTraining = modelMapper.map(personalTrainingDTO,PersonalTraining.class);
        PersonalTraining savedPersonalTraining = personalTrainingRepository.save(personalTraining);
        return savedPersonalTraining.getPtId();
    }

    //pt 데이터를 조회하는 입장 : 트레이너
    public List<PersonalTrainingDTO> selectByTrainer(Integer trainerId){
        List<PersonalTraining> result = personalTrainingRepository.findByTrainerId(trainerId);
        List<PersonalTrainingDTO> dtoList = new ArrayList<>();
        for(int i=0;i<result.size();i++){
            dtoList.add(modelMapper.map(result.get(i),PersonalTrainingDTO.class));
        }
        return dtoList;
    }

    //pt 데이터를 조회하는 입장 : 개인 유저
    public List<PersonalTrainingDTO> selectByUser(Integer userId){
        List<PersonalTraining> result = personalTrainingRepository.findByUserId(userId);
        List<PersonalTrainingDTO> dtoList = new ArrayList<>();
        for(int i=0;i<result.size();i++){
            dtoList.add(modelMapper.map(result.get(i),PersonalTrainingDTO.class));
        }
        return dtoList;
    }

    //pt 데이터 수정 메서드.
    //pt에 남은 pt 수를 업데이트 할 때 사용
    public void update(Integer ptId){
        Optional<PersonalTraining> result = personalTrainingRepository.findById(ptId);

        PersonalTraining personalTraining = result.orElseThrow();

        personalTraining.setPtCountRemain(personalTraining.getPtCountRemain()-1);
        personalTrainingRepository.save(personalTraining);
    }

    //pt 정보 삭제 메서드
    public void delete(Integer ptId){
        personalTrainingRepository.deleteById(ptId);
    }

    //pt가 존재하는지 확인용
    @PreAuthorize("(hasRole('ROLE_GENERAL')) && #userId == principal.userId")
    public Optional<PersonalTrainingDTO> findPT(Integer userId) {
        List<PersonalTraining> PT = personalTrainingRepository.findByUserId(userId);

        if (!PT.isEmpty()) {
            PersonalTraining firstTraining = PT.get(0); // For example, return the first training found
            PersonalTrainingDTO personalTrainingDTO = modelMapper.map(firstTraining, PersonalTrainingDTO.class);
            return Optional.of(personalTrainingDTO);
        }

        return Optional.empty();
    }
}
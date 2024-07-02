package com.dg.deukgeun.service;
//작성자 : 허승돈

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.ProductDTO;
import com.dg.deukgeun.dto.personalTraining.PersonalTrainingDTO;
import com.dg.deukgeun.dto.personalTraining.PersonalTrainingRequestDTO;
import com.dg.deukgeun.entity.Membership;
import com.dg.deukgeun.entity.PersonalTraining;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.PersonalTrainingRepository;
import com.dg.deukgeun.repository.TrainerRepository;
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
    private final MembershipService membershipService;
    private final ProductService productService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TrainerRepository trainerRepository;

    // 서비스를 구분하기 쉽도록 메서드의 이름은 각각 대응되는 mysql 쿼리 이름으로 적어두겠습니다.
    @PreAuthorize("(hasRole('ROLE_GENERAL')) && #userId == principal.userId")
    public Integer registerPersonalTraining(PersonalTrainingRequestDTO requestDTO, Integer userId) {
        // Check if membership exists for the user
        Optional<Membership> existingMembership = membershipService.findMembership(userId);

        // Initialize membershipId for use
        Integer membershipId;

        if (existingMembership.isPresent()) {
            // Membership already exists, use the existing membershipId
            membershipId = existingMembership.get().getMembershipId();
        } else {
            // Register new membership if it does not exist
            membershipId = membershipService.register(requestDTO.getMembershipDTO(), userId);
        }

        // Get product details
        ProductDTO productDTO = productService.get(requestDTO.getMembershipDTO().getProductId());

        // Set additional PT details
        PersonalTrainingDTO ptDTO = requestDTO.getPersonalTrainingDTO();
        ptDTO.setUserId(userId);
        ptDTO.setPtCountTotal(productDTO.getPtCountTotal());
        ptDTO.setPtCountRemain(productDTO.getPtCountTotal());
        ptDTO.setPtContent(productDTO.getProductName());
        ptDTO.setMembershipId(membershipId);

        // Save PT
        PersonalTraining personalTraining = modelMapper.map(ptDTO, PersonalTraining.class);
        PersonalTraining savedPersonalTraining = personalTrainingRepository.save(personalTraining);

        // Find and return the registered membership
        return savedPersonalTraining.getPtId();
    }

    // ptId로 search가 필요할 때 사용
    // ptSession에서 정보가 필요할 때 등
    public PersonalTrainingDTO selectByptId(Integer ptId) {
        Optional<PersonalTraining> result = personalTrainingRepository.findById(ptId);
        PersonalTraining personalTraining = result.orElseThrow();
        PersonalTrainingDTO personalTrainingDTO = modelMapper.map(personalTraining, PersonalTrainingDTO.class);
        return personalTrainingDTO;
    }

    // pt 데이터를 조회하는 입장 : 트레이너
    public List<PersonalTrainingDTO> selectByTrainer(Integer trainerId) {
        List<PersonalTraining> result = personalTrainingRepository.findByTrainer_TrainerId(trainerId);
        List<PersonalTrainingDTO> dtoList = new ArrayList<>();
        for (int i = 0; i < result.size(); i++) {
            dtoList.add(modelMapper.map(result.get(i), PersonalTrainingDTO.class));
        }
        return dtoList;
    }

    // pt 데이터를 조회하는 입장 : 개인 유저
    public List<PersonalTrainingDTO> selectByUser(Integer userId) {
        List<PersonalTraining> result = personalTrainingRepository.findAllByUser_UserId(userId);
        List<PersonalTrainingDTO> dtoList = new ArrayList<>();
        for (int i = 0; i < result.size(); i++) {
            dtoList.add(modelMapper.map(result.get(i), PersonalTrainingDTO.class));
        }
        return dtoList;
    }

    // pt 데이터 수정 메서드.
    // pt에 남은 pt 수를 업데이트 할 때 사용
    public void update(Integer ptId) {
        Optional<PersonalTraining> result = personalTrainingRepository.findById(ptId);

        PersonalTraining personalTraining = result.orElseThrow();

        personalTraining.setPtCountRemain(personalTraining.getPtCountRemain() - 1);
        personalTrainingRepository.save(personalTraining);
    }

    // pt에 남은 pt 수를 복구할 때, 즉, pt 일정이 취소되었을 때 사용
    public void plusRemain(Integer ptId) {
        Optional<PersonalTraining> result = personalTrainingRepository.findById(ptId);
        PersonalTraining personalTraining = result.orElseThrow();

        personalTraining.setPtCountRemain(personalTraining.getPtCountRemain() + 1);
        personalTrainingRepository.save(personalTraining);
    }

    // pt 정보 삭제 메서드
    public void delete(Integer ptId) {
        personalTrainingRepository.deleteById(ptId);
    }

    // pt가 존재하는지 확인용
    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_TRAINER')")
    public Optional<PersonalTraining> findPT(Integer userId) {
        List<PersonalTraining> PT = personalTrainingRepository.findAllByUser_UserId(userId);

        if (!PT.isEmpty()) {
            PersonalTraining firstTraining = PT.get(0); // For example, return the first training found
            // PersonalTrainingDTO personalTrainingDTO = modelMapper.map(firstTraining,
            // PersonalTrainingDTO.class);
            return Optional.of(firstTraining);
        }

        return Optional.empty();
    }

    @PreAuthorize("(hasRole('ROLE_TRAINER')) && #userId == principal.userId")
    public List<User> getUsersList(Integer userId) {
        List<User> users = new ArrayList<>();
        Trainer trainer = trainerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
        List<PersonalTraining> pts = personalTrainingRepository.findAllByTrainer(trainer)
                .orElseThrow(() -> new IllegalArgumentException("Pts not found"));
        pts.forEach(pt -> {
            users.add(pt.getUser());
        });
        return users;

    }
}

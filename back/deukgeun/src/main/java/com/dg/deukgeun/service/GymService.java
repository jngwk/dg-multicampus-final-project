package com.dg.deukgeun.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.dg.deukgeun.dto.PageRequestDTO;
import com.dg.deukgeun.dto.PageResponseDTO;
import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.dto.gym.GymDTO;
import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.UserRepository;
import com.dg.deukgeun.security.CustomUserDetails;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
// from gachudon brench
@Transactional
@RequiredArgsConstructor
@Log4j2
// gachudon brench end
public class GymService {
    // from gachudon brench
    private final ModelMapper modelMapper;
    // from gachudon brench

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseDTO<?> signUp(GymSignUpDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        // 이메일 중복 확인
        try {
            if (userRepository.existsByEmail(email)) {
                return ResponseDTO.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            System.out.println("데이터베이스 연결에 실패하였습니다. " + e.getMessage());
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
        // 비밀번호 확인
        if (!password.equals(dto.getPassword())) {
            return ResponseDTO.setFailed("비밀번호가 일치하지 않습니다.");
        }
        // User 엔티티 생성
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        user.setDetailAddress(dto.getDetailAddress());
        user.setRole(UserRole.ROLE_GYM); // 역할 설정
        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);
        // User 엔티티를 데이터베이스에 저장
        try {
            userRepository.save(user);
        } catch (Exception e) {
            System.out.println("데이터베이스 연결에 실패하였습니다. " + e.getMessage());
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
        // Gym 엔티티 생성
        Gym gym = new Gym();
        gym.setUser(user);
        gym.setGymName(dto.getGymName());
        gym.setCrNumber(dto.getCrNumber());
        gym.setPhoneNumber(dto.getPhoneNumber());
        gym.setAddress(dto.getAddress());
        gym.setDetailAddress(dto.getDetailAddress());
        gym.setOperatingHours(dto.getOperatingHours());
        gym.setPrices(dto.getPrices());
        gym.setIntroduce(dto.getIntroduce());
        // gym.setApproval(dto.getApproval());

        // Gym 엔티티를 데이터베이스에 저장
        try {
            gymRepository.save(gym);
        } catch (Exception e) {
            System.out.println("데이터베이스 연결에 실패하였습니다. " + e.getMessage());
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
        // 사용자 정보 응답 DTO 생성
        return ResponseDTO.setSuccess("Gym 회원 생성에 성공했습니다.");
    }

    // from gachudon brench
    // GymDTO 형태로 데이터 불러오기
    public GymDTO get(Integer gymId) {
        Optional<Gym> result = gymRepository.findById(gymId);
        Gym gym = result.orElseThrow();
        GymDTO dto = modelMapper.map(gym, GymDTO.class);
        return dto;
    }

    // 새로운 헬스장 정보 입력
    public Integer insert(GymDTO gymDTO) {
        log.info("--------------------");
        Gym gym = modelMapper.map(gymDTO, Gym.class);
        Gym savedGym = gymRepository.save(gym);
        return savedGym.getGymId();
    }

    @PreAuthorize("hasRole('ROLE_GYM')")
    public void modify(GymDTO gymDTO) {
        Optional<Gym> result = gymRepository.findById(gymDTO.getGymId());
        Gym gym = result.orElseThrow();
        gym.setAddress(gymDTO.getAddress());
        gym.setCrNumber(gymDTO.getCrNumber());
        gym.setDetailAddress(gymDTO.getDetailAddress());
        gym.setGymName(gymDTO.getGymName());
        gym.setIntroduce(gymDTO.getIntroduce());
        gym.setOperatingHours(gymDTO.getOperatingHours());
        gym.setPhoneNumber(gymDTO.getPhoneNumber());
        gym.setPrices(gymDTO.getPrices());
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        // 잘 실행될 지는 모르겠음 실행 후 확인 필요
        User user = new User();
        user.setUserId(userDetails.getUserId());
        gym.setUser(user);
        gymRepository.save(gym);
    }

    public void remove(Integer gymId) {
        gymRepository.deleteById(gymId);
    }

    public PageResponseDTO<GymDTO> listWithPaging(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                Sort.by("gymId").descending());
        Page<Gym> result = gymRepository.findAll(pageable);
        List<GymDTO> dtoList = result.getContent().stream()
                .map(gym -> modelMapper.map(gym, GymDTO.class))
                .collect(Collectors.toList());
        long totalCount = result.getTotalElements();
        PageResponseDTO<GymDTO> responseDTO = PageResponseDTO.<GymDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    public List<Gym> list() {
        return gymRepository.findAll();
    }
    // gachudon brench end

    public List<Gym> searchGyms(String searchWord) {
        String processedSearchWord = searchWord.replaceAll("\\s+", "").toLowerCase();
        return gymRepository.searchGyms(processedSearchWord);
    }
}

package com.dg.deukgeun.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.UserRepository;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired 
    UserRepository userRepository;

    @Autowired
    private GymRepository gymRepository;

    public ResponseDTO<List<User>> getAllUsers(String adminEmail, String searchQuery) {
        try {
            // 관리자 이메일이 ADMIN 사용자에 속하는지 확인합니다.
            Optional<User> adminOptional = userRepository.findByEmail(adminEmail);
            if (adminOptional.isPresent()) {
                // 모든 역할의 사용자를 가져옵니다.
                List<User> users;
                if (searchQuery != null && !searchQuery.isEmpty()) {
                    // 검색 쿼리를 포함하는 이름 또는 주소로 사용자를 가져옵니다.
                    users = userRepository.findByUserNameContainingIgnoreCase(searchQuery);
                } else {
                    users = userRepository.findAll();
                }
                // 보안상의 이유로 비밀번호 필드를 빈 문자열로 설정합니다.
                for (User user : users) {
                    user.setPassword("");
                }
                return ResponseDTO.setSuccessData("모든 사용자 목록을 가져왔습니다.", users);
            } else {
                return ResponseDTO.setFailed("권한이 없습니다.");
            }
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }
    }

    public ResponseDTO<List<Map<String, Object>>> getAllGymUsers(String searchQuery) {
        List<Gym> gyms;
        
        try {
            gyms = gymRepository.findAll();
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // Gym 엔티티에서 유저와 헬스장 정보를 Map으로 변환하여 목록 추출
        List<Map<String, Object>> gymUsers = gyms.stream()
                                                 .map(gym -> {
                                                     Map<String, Object> gymUserMap = new HashMap<>();
                                                     gymUserMap.put("userId", gym.getUser().getUserId());
                                                     gymUserMap.put("userName", gym.getUser().getUserName());
                                                     gymUserMap.put("address", gym.getAddress());
                                                     gymUserMap.put("detailAdress", gym.getDetailAddress());
                                                     gymUserMap.put("gymId", gym.getGymId());
                                                     gymUserMap.put("gymName", gym.getGymName());
                                                     return gymUserMap;
                                                 })
                                                 .collect(Collectors.toList());

        if (searchQuery != null && !searchQuery.isEmpty()) {
            gymUsers = gymUsers.stream()
                               .filter(user -> ((String) user.get("userName")).toLowerCase().contains(searchQuery.toLowerCase()) ||
                                               ((String) user.get("address")).toLowerCase().contains(searchQuery.toLowerCase()))
                               .collect(Collectors.toList());
        }

        return ResponseDTO.setSuccessData("헬스장을 운영하고 있는 유저 목록 조회에 성공했습니다.", gymUsers);
    }
}

package com.dg.deukgeun.service;

import java.util.List;
import java.util.Optional;
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
            if (adminOptional.isPresent() && "ADMIN".equals(adminOptional.get().getRole())) {
                List<User> users;
                if (searchQuery != null && !searchQuery.isEmpty()) {
                    // 검색 쿼리를 포함하는 이름으로 사용자를 가져옵니다.
                    users = userRepository.findByUserNameContainingIgnoreCase(searchQuery);
                } else {
                    // 역할이 USER인 모든 사용자를 가져옵니다.
                    users = userRepository.findByRole("USER");
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

    public ResponseDTO<?> getAllGymUsers(String searchQuery) {
        List<Gym> gyms;
        
        try {
            gyms = gymRepository.findAll();
        } catch (Exception e) {
            return ResponseDTO.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // Gym 엔티티에서 유저 목록 추출
        List<User> gymUsers = gyms.stream()
                                  .map(Gym::getUser)
                                  .collect(Collectors.toList());

        if (searchQuery != null && !searchQuery.isEmpty()) {
            gymUsers = gymUsers.stream()
                               .filter(user -> user.getUserName().toLowerCase().contains(searchQuery.toLowerCase()))
                               .collect(Collectors.toList());
        }

        // 보안상의 이유로 비밀번호 필드를 빈 문자열로 설정합니다.
        for (User user : gymUsers) {
            user.setPassword("");
        }

        return ResponseDTO.setSuccessData("헬스장을 운영하고 있는 유저 목록 조회에 성공했습니다.", gymUsers);
    }
}
 
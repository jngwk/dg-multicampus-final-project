package com.dg.deukgeun.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.UserRepository;

@Service
public class AdminService {

    @Autowired 
    UserRepository userRepository;

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
}
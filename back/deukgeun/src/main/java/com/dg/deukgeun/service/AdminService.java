package com.dg.deukgeun.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.page.PageRequestDTO;
import com.dg.deukgeun.dto.page.PageResponseDTO;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.UserRepository;

@Service
public class AdminService {

    @Autowired 
    UserRepository userRepository;


    public PageResponseDTO<User> getAllUsers(Integer adminId, String searchQuery, PageRequestDTO pageRequestDTO) {
        try {
            // 관리자 이메일이 ADMIN 사용자에 속하는지 확인합니다.
            Optional<User> adminOptional = userRepository.findById(adminId);
            if (adminOptional.isPresent()) {
                Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(), Sort.by("userId").ascending());
                List<User> users;
                long totalUsers;
                if (searchQuery != null && !searchQuery.isEmpty()) {
                    users = userRepository.findByUserNameContainingIgnoreCase(searchQuery, pageable).getContent();
                    totalUsers = userRepository.countByUserNameContainingIgnoreCase(searchQuery);
                } else {
                    users = userRepository.findAll(pageable).getContent();
                    totalUsers = userRepository.count();
                }
                // 보안상의 이유로 비밀번호 필드를 빈 문자열로 설정합니다.
                for (User user : users) {
                    user.setPassword("");
                }
                return PageResponseDTO.<User>withAll()
                        .dtoList(users)
                        .pageRequestDTO(pageRequestDTO)
                        .totalCount(totalUsers)
                        .build();
            } else {
                throw new IllegalAccessException("권한이 없습니다.");
            }
        } catch (Exception e) {
            throw new RuntimeException("데이터베이스 연결에 실패하였습니다.", e);
        }
    }


}
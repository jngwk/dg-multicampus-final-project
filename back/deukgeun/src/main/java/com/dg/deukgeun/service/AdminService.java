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
<<<<<<< HEAD
import org.springframework.security.access.prepost.PreAuthorize;
=======
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.page.PageRequestDTO;
import com.dg.deukgeun.dto.page.PageResponseDTO;
<<<<<<< HEAD
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.GymRepository;
=======
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.entity.User;
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
import com.dg.deukgeun.repository.UserRepository;

@Service
public class AdminService {

    @Autowired 
    UserRepository userRepository;

<<<<<<< HEAD
    @Autowired
    private GymRepository gymRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PageResponseDTO<User> getAllUsers(Integer adminId, PageRequestDTO pageRequestDTO) {
=======

    public PageResponseDTO<User> getAllUsers(Integer adminId, String searchQuery, PageRequestDTO pageRequestDTO) {
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
        try {
            // 관리자 이메일이 ADMIN 사용자에 속하는지 확인합니다.
            Optional<User> adminOptional = userRepository.findById(adminId);
            if (adminOptional.isPresent()) {
                Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(), Sort.by("userId").ascending());
                List<User> users;
                long totalUsers;
<<<<<<< HEAD
                // if (searchQuery != null && !searchQuery.isEmpty()) {
                //     users = userRepository.findByUserNameContainingIgnoreCase(searchQuery, pageable).getContent();
                //     totalUsers = userRepository.countByUserNameContainingIgnoreCase(searchQuery);
                // } else {
                //     users = userRepository.findAll(pageable).getContent();
                //     totalUsers = userRepository.count();
                // }
                users = userRepository.findAll(pageable).getContent();
                totalUsers = userRepository.count();
=======
                if (searchQuery != null && !searchQuery.isEmpty()) {
                    users = userRepository.findByUserNameContainingIgnoreCase(searchQuery, pageable).getContent();
                    totalUsers = userRepository.countByUserNameContainingIgnoreCase(searchQuery);
                } else {
                    users = userRepository.findAll(pageable).getContent();
                    totalUsers = userRepository.count();
                }
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
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

<<<<<<< HEAD
    // public PageResponseDTO<Map<String, Object>> getAllGymUsers(String searchQuery, PageRequestDTO pageRequestDTO) {
    //     try {
    //         List<Gym> gyms = gymRepository.findAll();
    //         List<Map<String, Object>> gymUsers = gyms.stream()
    //                 .map(gym -> {
    //                     Map<String, Object> gymUserMap = new HashMap<>();
    //                     gymUserMap.put("userId", gym.getUser().getUserId());
    //                     gymUserMap.put("userName", gym.getUser().getUserName());
    //                     gymUserMap.put("address", gym.getAddress());
    //                     gymUserMap.put("detailAddress", gym.getDetailAddress());
    //                     gymUserMap.put("gymId", gym.getGymId());
    //                     gymUserMap.put("gymName", gym.getGymName());
    //                     return gymUserMap;
    //                 })
    //                 .collect(Collectors.toList());

    //         if (searchQuery != null && !searchQuery.isEmpty()) {
    //             gymUsers = gymUsers.stream()
    //                     .filter(user -> ((String) user.get("userName")).toLowerCase().contains(searchQuery.toLowerCase()) ||
    //                             ((String) user.get("address")).toLowerCase().contains(searchQuery.toLowerCase()))
    //                     .collect(Collectors.toList());
    //         }

    //         int totalGymUsers = gymUsers.size();
    //         int start = (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize();
    //         int end = Math.min(start + pageRequestDTO.getSize(), totalGymUsers);
    //         List<Map<String, Object>> paginatedGymUsers = gymUsers.subList(start, end);

    //         return PageResponseDTO.<Map<String, Object>>withAll()
    //                 .dtoList(paginatedGymUsers)
    //                 .pageRequestDTO(pageRequestDTO)
    //                 .totalCount(totalGymUsers)
    //                 .build();

    //     } catch (Exception e) {
    //         throw new RuntimeException("데이터베이스 연결에 실패하였습니다.", e);
    //     }
    // }
}
=======

}
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

package com.dg.deukgeun.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import com.dg.deukgeun.Entity.UserEntity;
import com.dg.deukgeun.dto.UserDTO;
import com.dg.deukgeun.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void save(@Validated UserDTO userDTO) {
        // repository의 save 메서드 호출
        UserEntity userEntity = UserEntity.toUserEntity(userDTO);
        userRepository.save(userEntity);
    }

    public UserDTO login(UserDTO userDTO) {
        Optional<UserEntity> byEmail = userRepository.findByEmail(userDTO.getEmail());
        if (byEmail.isPresent()) {
            // 조회 결과가 있다
            UserEntity userEntity = byEmail.get(); // Optional에서 꺼냄
            if (userEntity.getPassword().equals(userDTO.getPassword())) {
                // 비밀번호 일치
                return UserDTO.toUserDTO(userEntity); // entity -> dto 변환 후 리턴
            } else {
                // 비밀번호 불일치
                return null;
            }
        } else {
            // 조회 결과가 없다
            return null;
        }
    }

    // 이메일 존재 여부를 확인하는 메서드
    public boolean isEmailExist(String email) {
        return userRepository.existsByEmail(email);
    }
}
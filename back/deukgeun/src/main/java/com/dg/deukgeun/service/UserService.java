package com.dg.deukgeun.service;

import java.util.Optional;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dg.deukgeun.Entity.UserEntity;
import com.dg.deukgeun.dto.UserDTO;
import com.dg.deukgeun.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void save(UserDTO userDTO) {
        // repsitory의 save 메서드 호출
        UserEntity userEntity = UserEntity.toUserEntity(userDTO);
        userRepository.save(userEntity);
        //Repository의 save메서드 호출 (조건. entity객체를 넘겨줘야 함)

    }

    public UserDTO login(UserDTO userDTO) { // entity객체는 service에서만
        Optional<UserEntity> byEmail = userRepository.findByEmail(userDTO.getEmail());
        if (byEmail.isPresent()) {
            // 조회 결과가 있다
            UserEntity userEntity = byEmail.get(); // Optional에서 꺼냄
            if (userEntity.getPassword().equals(userDTO.getPassword())) {
                // 비밀번호 일치
                // entity -> dto 변환 후 리턴
                UserDTO dto = UserDTO.toUserDTO(userEntity);
                return dto;
            } else {
                // 비밀번호 불일치
                return null;
            }
        } else {
            // 조회 결과가 없다
            return null;
        }
    }

}

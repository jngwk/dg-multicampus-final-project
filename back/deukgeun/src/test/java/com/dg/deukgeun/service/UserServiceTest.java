package com.dg.deukgeun.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.Entity.UserEntity;
import com.dg.deukgeun.dto.user.ResponseDTO;
import com.dg.deukgeun.dto.user.SignUpDTO;
import com.dg.deukgeun.repository.UserRepository;

@SpringBootTest
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSignUp_Success() {
        SignUpDTO dto = new SignUpDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("password");
        // dto.setConfirmPassword("password");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(UserEntity.class))).thenReturn(new UserEntity());

        ResponseDTO<?> response = userService.signUp(dto);

        assertTrue(response.isResult());
        assertEquals("회원 생성에 성공했습니다.", response.getMessage());
    }

    @Test
    public void testSignUp_EmailAlreadyExists() {
        SignUpDTO dto = new SignUpDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("password");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        ResponseDTO<?> response = userService.signUp(dto);

        assertFalse(response.isResult());
        assertEquals("중복된 Email 입니다.", response.getMessage());
    }

    @Test
    public void testGetUserInfo_Success() {
        String email = "test@example.com";
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(email);
        userEntity.setPassword("password");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));

        ResponseDTO<UserEntity> response = userService.getUserInfo(email);

        assertTrue(response.isResult());
        assertNotNull(response.getData());
        assertEquals(email, response.getData().getEmail());
        assertEquals("", response.getData().getPassword());
    }

    @Test
    public void testGetUserInfo_UserNotFound() {
        String email = "nonexistent@example.com";

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        ResponseDTO<UserEntity> response = userService.getUserInfo(email);

        assertFalse(response.isResult());
        assertEquals("해당 이메일로 가입된 사용자를 찾을 수 없습니다.", response.getMessage());
    }
}

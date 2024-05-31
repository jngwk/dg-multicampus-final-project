package com.dg.deukgeun.repository;

import com.dg.deukgeun.dto.UsersDTO;
import com.dg.deukgeun.domain.Users;
import com.dg.deukgeun.repository.UsersRepository;
import com.dg.deukgeun.service.UsersService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UsersService usersService;

    @MockBean
    private UsersRepository usersRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Test
    public void getUserTest() {
        Integer userId = 1;
        Users users = new Users();
        users.setUserId(userId);
        users.setAddress("123 Main St");
        users.setApproval(true);
        users.setDetail_address("Apt 4B");

        Mockito.when(usersRepository.findById(userId)).thenReturn(Optional.of(users));

        UsersDTO usersDTO = usersService.get(userId);

        assertThat(usersDTO).isNotNull();
        assertThat(usersDTO.getUserId()).isEqualTo(userId);
        assertThat(usersDTO.getAddress()).isEqualTo("123 Main St");
        assertThat(usersDTO.isApproval()).isTrue();
        assertThat(usersDTO.getDetail_address()).isEqualTo("Apt 4B");
    }
}

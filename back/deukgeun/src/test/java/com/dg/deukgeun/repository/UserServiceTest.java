package com.dg.deukgeun.repository;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.Entity.UserEntity;
import com.dg.deukgeun.service.UserService;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;


@SpringBootTest
@Log4j2
public class UserServiceTest {

    @Autowired
    private UserService us;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testIntsert(){
        for(int i =1 ; i <=10; i++){
            UserEntity user = UserEntity.builder().userName("이름.."+i).email("email.."+i).address("주소.."+ i).category("일반회원").password("123"+i).approval(1).build();
            userRepository.save(user);
            log.info("-----------------------------------");
        }
    }

    @Test
    @Transactional
    public void testInfo(){
        Integer id = 1;
        Optional<UserEntity> result = userRepository.findById(id);
        UserEntity user = result.orElseThrow();
        log.info(user);
    }

}
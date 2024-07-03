package com.dg.deukgeun.repository;

import java.util.Optional;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dg.deukgeun.entity.Membership;
import com.dg.deukgeun.entity.Product;
import com.dg.deukgeun.entity.User;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class MembershipRepositoryTest {
    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    public void findByUserAndProductTest(){
        User user = userRepository.findByUserId(3).orElse(null);
        Product product = productRepository.findById(1).orElse(null);
        Optional<Membership> membershipOptional = membershipRepository.findByUserAndProduct(user, product);
        log.info(membershipOptional);
    }
}

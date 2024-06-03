package com.dg.deukgeun.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dg.deukgeun.Entity.Trainer;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> findByEmail(String email);

     // 이메일 존재 여부를 확인하는 메서드
     boolean existsByEmail(String email);

     // // password 존재 여부를 확인하는 메서드
     // boolean existsByPassword(String password);
 
     // email과 password의 존재 여부 확인 메서드
     public boolean existsByEmailAndPassword(String email, String password);
}
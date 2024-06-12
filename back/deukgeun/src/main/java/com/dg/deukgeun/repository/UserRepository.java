package com.dg.deukgeun.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    // 반환 타입은 Optional이며, 이는 조회 결과가 없을 경우 null 대신 Optional.empty()를 반환하여 NullPointer
    // 예외를 방지
    Optional<User> findByEmail(String email);

    // 이메일 존재 여부를 확인하는 메서드
    boolean existsByEmail(String email);

    // email과 password의 존재 여부 확인 메서드
    public boolean existsByEmailAndPassword(String email, String password);

     //role에 따른 목록 조회를 위한 메서드
     List<User> findByRole(UserRole role);

     //userName으로 검색
     List<User> findByUserNameContainingIgnoreCase(String userName);
     Page<User> findByUserNameContainingIgnoreCase(String userName, Pageable pageable);
     long countByUserNameContainingIgnoreCase(String userName);
}

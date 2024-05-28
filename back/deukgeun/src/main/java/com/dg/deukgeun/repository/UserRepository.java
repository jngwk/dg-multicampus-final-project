package com.dg.deukgeun.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.Entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>{
    Optional<UserEntity> findByEmail(String email);
}

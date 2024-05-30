package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.domain.Users;

public interface UsersRepository extends JpaRepository<Users,Integer>{
    
}

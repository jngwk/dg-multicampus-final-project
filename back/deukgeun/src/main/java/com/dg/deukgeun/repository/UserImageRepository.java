package com.dg.deukgeun.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.UserImage;

public interface UserImageRepository extends JpaRepository<UserImage,String>{
    public List<UserImage> findByUserId(Integer userId);
}

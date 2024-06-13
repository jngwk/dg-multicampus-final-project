package com.dg.deukgeun.repository;
//written by Gachudon


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.GymImage;

public interface GymImageRepository extends JpaRepository<GymImage,String>{
    List<GymImage> findByGymId(Integer gymId);
}

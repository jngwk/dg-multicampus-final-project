package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.PersonalTraining;
import java.util.List;


public interface PersonalTrainingRepository extends JpaRepository<PersonalTraining,Integer>{
    List<PersonalTraining> findByTrainerId(Integer trainerId);
    List<PersonalTraining> findByUserId(Integer userId);
}
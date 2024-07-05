package com.dg.deukgeun.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.PersonalTraining;
import com.dg.deukgeun.entity.Trainer;
import com.dg.deukgeun.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PersonalTrainingRepository extends JpaRepository<PersonalTraining, Integer> {
    List<PersonalTraining> findByTrainer_TrainerId(Integer trainerId);

    List<PersonalTraining> findAllByUser_UserId(Integer userId);

    Optional<PersonalTraining> findByUser(User user);
    Optional<PersonalTraining> findByMembershipId(Integer membershipId);

    Optional<List<PersonalTraining>> findAllByTrainer(Trainer trainer);

    List<PersonalTraining> findAllByTrainer_TrainerId(Integer userId);

    List<PersonalTraining> findAllByTrainer_TrainerIdIn(List<Integer> trainerIds);
}

package com.dg.deukgeun.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;

public interface GymRepository extends JpaRepository<Gym, Integer> {
    Optional<Gym> findByUser(User user);

    @Query("SELECT g FROM Gym g JOIN g.user u WHERE "
            + "REPLACE(LOWER(u.userName), ' ', '') LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR REPLACE(LOWER(g.gymName), ' ', '') LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR REPLACE(LOWER(g.address), ' ', '') LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Gym> searchGyms(@Param("keyword") String keyword);

    public Optional<Gym> findByUser_UserId(Integer userId);

    Optional<Gym> findByCrNumber(String crNumber);
}
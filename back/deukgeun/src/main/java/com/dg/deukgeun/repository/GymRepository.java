package com.dg.deukgeun.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.User;

public interface GymRepository extends JpaRepository<Gym, Integer> {
        Optional<Gym> findByUser(User user);

        @Query("SELECT g FROM Gym g JOIN g.user u WHERE "
                        + "REPLACE(LOWER(u.userName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.gymName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.address), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%'))")
        List<Gym> searchGyms(@Param("searchWord") String searchWord);

        @Query("SELECT g FROM Gym g JOIN g.user u WHERE "
                        + "g.operatingHours LIKE CONCAT('%', '24시간', '%') AND ("
                        + "REPLACE(LOWER(u.userName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.gymName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.address), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')))")
        List<Gym> searchGymsByOperatingHours(@Param("searchWord") String searchWord);

        @Query("SELECT g FROM Gym g JOIN g.user u WHERE "
                        + "g.address LIKE CONCAT('%', :location, '%') AND ("
                        + "REPLACE(LOWER(u.userName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.gymName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.address), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')))")
        List<Gym> searchGymsByLocation(@Param("searchWord") String searchWord, @Param("location") String location);

        @Query("SELECT g FROM Gym g JOIN g.user u JOIN g.products p "
                        + "WHERE p.productName LIKE '%1개월%' "
                        + "AND p.productName NOT LIKE '%PT%' "
                        + "AND ("
                        + "REPLACE(LOWER(u.userName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.gymName), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%')) "
                        + "OR REPLACE(LOWER(g.address), ' ', '') LIKE LOWER(CONCAT('%', :searchWord, '%'))"
                        + ") "
                        + "GROUP BY g "
                        + "HAVING AVG(p.price) IS NOT NULL AND AVG(p.price) <= ALL (SELECT AVG(p2.price) FROM Product p2 WHERE p2.productName LIKE '%1개월%' AND p2.productName NOT LIKE '%PT%') "
                        + "ORDER BY AVG(p.price) ASC")
        Page<Gym> searchGymsByPrice(@Param("searchWord") String searchWord, Pageable pageable);

        public Optional<Gym> findByUser_UserId(Integer userId);

        Optional<Gym> findByCrNumber(String crNumber);
}
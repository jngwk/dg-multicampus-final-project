package com.dg.deukgeun.repository;

import java.util.List;
import java.util.Optional;

//작성자 : 허승돈
//수정자 : 허승돈
//수정: 손영우
import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    public List<Product> findAllBygymGymId(Integer gymId);

    public void deleteBygymGymId(Integer gymId);

    public Optional<Product> findBygymGymId(Integer gymId);
}

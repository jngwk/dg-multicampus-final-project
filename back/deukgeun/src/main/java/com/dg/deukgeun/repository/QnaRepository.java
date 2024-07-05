package com.dg.deukgeun.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.Qna;

public interface QnaRepository extends JpaRepository<Qna, Integer> {

    Page<Qna> findAllByUser_UserId(Integer userId, Pageable pageable);

}

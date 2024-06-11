package com.dg.deukgeun.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.PageRequestDTO;
import com.dg.deukgeun.dto.PageResponseDTO;
import com.dg.deukgeun.dto.QnaDTO;
import com.dg.deukgeun.service.QnaService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/qna")
public class QnaController {

    @Autowired
    private QnaService qnaService;

    @PostMapping("/register")    // 삽입
    public Map<String, Integer> register(@RequestBody QnaDTO qnaDTO) {
        log.info("QnaDTO: " + qnaDTO);
        Integer qnaId = qnaService.register(qnaDTO);
        return Map.of("QnaId", qnaId);
    }

    @GetMapping("/{qnaId}")  // 읽기
    public QnaDTO get(@PathVariable(name="qnaId") Integer qnaId) {
        return qnaService.get(qnaId);
    }

    @GetMapping("/list")  // 리스트
    public PageResponseDTO<QnaDTO> list(PageRequestDTO pageRequestDTO) {
        log.info(pageRequestDTO);
        return qnaService.list(pageRequestDTO);
    }

    @PutMapping("/{qnaId}")  // 수정
    public Map<String, String> modify(@PathVariable(name="qnaId") Integer qnaId, @RequestBody QnaDTO qnaDTO) {
        qnaDTO.setQnaId(qnaId);
        log.info("Modify: " + qnaDTO);
        qnaService.modify(qnaDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/{qnaId}")  // 삭제
    public Map<String, String> remove(@PathVariable(name="qnaId") Integer qnaId) {
        log.info("Remove: " + qnaId);
        qnaService.remove(qnaId);
        return Map.of("RESULT", "SUCCESS");
    }
}
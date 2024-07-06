package com.dg.deukgeun.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.PageRequestDTO;
import com.dg.deukgeun.dto.PageResponseDTO;
import com.dg.deukgeun.dto.QnaDTO;
import com.dg.deukgeun.entity.Qna;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.QnaRepository;
import com.dg.deukgeun.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class QnaService {

    private final QnaRepository qnaRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public Integer register(QnaDTO qnaDTO) {
        log.info("Registering QnaDTO...");

        Qna qna = modelMapper.map(qnaDTO, Qna.class);

        if (qnaDTO.getUserId() != null) {
            Optional<User> userResult = userRepository.findById(qnaDTO.getUserId());
            if (userResult.isPresent()) {
                User user = userResult.get();
                qna.setUser(user); // Associate user with Qna
                qna.setUserName(user.getUserName());
                qna.setEmail(user.getEmail());
            } else {
                log.warn("User with userId {} not found", qnaDTO.getUserId());
            }
        } else {
            qna.setUser(null);
            qna.setUserName(qnaDTO.getUserName());
            qna.setEmail(qnaDTO.getEmail());
        }

        if (qna.getRegDate() == null) {
            qna.setRegDate(LocalDate.now()); // Set regDate to the current date
        }

        Qna savedQna = qnaRepository.save(qna);
        return savedQna.getQnaId();
    }

    public QnaDTO get(Integer qnaId) {
        Optional<Qna> result = qnaRepository.findById(qnaId);
        Qna qna = result.orElseThrow();
        return modelMapper.map(qna, QnaDTO.class);
    }

    public void modify(QnaDTO qnaDTO) {
        Optional<Qna> result = qnaRepository.findById(qnaDTO.getQnaId());
        Qna qna = result.orElseThrow();

        if (qnaDTO.getReply() != null) {
            qna.setReply(qnaDTO.getReply());
            qna.setReplyDate(qnaDTO.getReplyDate());
        } else {
            qna.setTitle(qnaDTO.getTitle());
            qna.setContent(qnaDTO.getContent());
        }

        qnaRepository.save(qna);
    }

    public void remove(Integer qnaId) {
        qnaRepository.deleteById(qnaId);
    }

    public PageResponseDTO<QnaDTO> list(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // Page number starts from 0
                pageRequestDTO.getSize(),
                Sort.by("qnaId").descending());

        Page<Qna> result = qnaRepository.findAll(pageable);
        List<QnaDTO> dtoList = result.getContent().stream()
                .map(qna -> modelMapper.map(qna, QnaDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<QnaDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    public PageResponseDTO<QnaDTO> listByUserId(Integer userId, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // Page number starts from 0
                pageRequestDTO.getSize(),
                Sort.by("qnaId").descending());

        Page<Qna> result = qnaRepository.findAllByUser_UserId(userId, pageable);
        List<QnaDTO> dtoList = result.getContent().stream()
                .map(qna -> modelMapper.map(qna, QnaDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<QnaDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    // public void sendQnaRegisterEmail(Integer qnaId) {
    // Qna qna = qnaRepository.findById(qnaId).get();
    // // 등록 이메일 전송
    // emailService.sendQnaRegisterNotification(qna);

    // }

    // public void sendQnaReplyEmail(Integer qnaId) {
    // Qna qna = qnaRepository.findById(qnaId).get();
    // if (qna.getReply() != null) {
    // // 답변 이메일 전송
    // emailService.sendQnaReplyNotification(qna);
    // }
    // }
}

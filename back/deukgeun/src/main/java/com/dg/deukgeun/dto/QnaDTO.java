package com.dg.deukgeun.dto;

import java.time.LocalDate;

import com.dg.deukgeun.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaDTO {
    private Integer qnaId;
    private User user;
    private Integer userId;
    private String userName;
    private String email;
    private String title;
    private String content;
    private String reply;
    private LocalDate replyDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate regDate;
}

package com.dg.deukgeun.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.Entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChatId(Integer chatId);

}

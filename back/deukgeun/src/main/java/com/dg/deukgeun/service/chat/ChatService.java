package com.dg.deukgeun.service.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.ChatMessage;
import com.dg.deukgeun.repository.ChatMessageRepository;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public List<ChatMessage> getChatHistory(Integer chatId) {
        return chatMessageRepository.findByChatId(chatId);
    }

}

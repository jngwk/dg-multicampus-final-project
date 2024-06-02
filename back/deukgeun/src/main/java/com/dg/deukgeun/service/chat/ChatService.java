package com.dg.deukgeun.service.chat;

import java.util.List;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.ChatMessage;
import com.dg.deukgeun.repository.ChatMessageRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ChatService { // 채팅 기록을 불러오고 발행/구독을 하는 서비스
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public void sendMessage(ChatMessage chatMessage) {
        log.info("Sending message:" + chatMessage);
        rabbitTemplate.convertAndSend("chatExchange", "chat.message", chatMessage);
    }

    @RabbitListener(queues = "chatQueue")
    public void receiveMessage(ChatMessage chatMessage) {
        log.info("Received message: " + chatMessage);
        chatMessageRepository.save(chatMessage);
        messagingTemplate.convertAndSend("/topic/" + chatMessage.getChatRoomId(), chatMessage);
    }

    public List<ChatMessage> getChatHistory(Integer chatId) {
        return chatMessageRepository.findByChatId(chatId);
    }

}

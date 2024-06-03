package com.dg.deukgeun.service;

import java.util.List;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.ChatMessage;
import com.dg.deukgeun.repository.ChatMessageRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ChatService { // 채팅 기록을 불러오고 발행/구독을 하는 서비스
    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // 메시지 발행
    public void sendMessage(ChatMessage chatMessage) {
        log.info("Sending message using chatService:" + chatMessage);
        log.info("Routing Key: " + routingKey);
        log.info("Exchange: " + exchange);
        rabbitTemplate.convertAndSend(exchange, routingKey, chatMessage); // rabbitMQ 로 메시지를 보낼 때 rabbitTemplate 사용
    }

    // 메시지 구독
    @RabbitListener(queues = { "${rabbitmq.queue.name}" }) // 특정 queue로 메시지를 보냄
    public void receiveMessage(ChatMessage chatMessage) {
        log.info("Received message using chatService: " + chatMessage);
        // chatMessageRepository.save(chatMessage); // db에 저장
        try {
            Thread.sleep(5000); // 5 seconds delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        // websocket을 사용해 broadcast 할 때 SimpMessagingTemplate을 사용
        messagingTemplate.convertAndSend("/topic/" + chatMessage.getChatRoomId(), chatMessage);
    }

    // 메시지 기록 불러오기
    public List<ChatMessage> getChatHistory(Integer chatId) {
        return chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatId);
    }

}

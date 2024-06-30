package com.dg.deukgeun.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.entity.ChatMessage;
import com.dg.deukgeun.entity.ChatRoom;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.repository.ChatMessageRepository;
import com.dg.deukgeun.repository.ChatRoomRepository;
import com.dg.deukgeun.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

/* TODO 메시지 브로드 캐스팅하는 메소드 추가하기 */
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    // 메시지 발행
    public void sendMessage(ChatMessage chatMessage) {
        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@ sendMessage service");
        log.info("Sending message using chatService:" + chatMessage);
        log.info("Routing Key: " + routingKey);
        log.info("Exchange: " + exchange);

        String dynamicRoutingKey = "chat." + chatMessage.getChatRoom().getId();
        log.info("Dynamic Routing Key: " + dynamicRoutingKey);

        // rabbitMQ 로 메시지를 보낼 때 rabbitTemplate 사용
        rabbitTemplate.convertAndSend(exchange, dynamicRoutingKey, chatMessage);
        log.info("Message sent through rabbitMQ");

    }

    // 메시지 구독
    @RabbitListener(queues = { "${rabbitmq.queue.name}" }) // 특정 queue로 메시지를 보냄
    public void receiveMessage(ChatMessage chatMessage) {

        log.info("Received message using chatService: " + chatMessage);

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage); // db에 저장
        log.info("Message saved in DB: " + savedMessage);

        ChatRoom chatRoom = savedMessage.getChatRoom();
        chatRoom.setLatestMessage(savedMessage.getMessage());
        chatRoomRepository.save(chatRoom);
        log.info("Latest message saved in DB: " + chatRoom.getLatestMessage());

        // websocket을 사용해 broadcast 할 때 SimpMessagingTemplate을 사용
        messagingTemplate.convertAndSend("/topic/" + savedMessage.getChatRoom().getId(), savedMessage);
    }

    // 메시지 기록 불러오기
    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')")
    public List<ChatMessage> getChatHistory(Integer chatId) {
        return chatMessageRepository.findByChatRoomIdOrderByTimestamp(chatId);
    }

    // 대화방 존재하는지 확인하기
    @PreAuthorize("(hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')) &&" +
            "#currentUserId == principal.userId")
    public ChatRoom findOrCreateChatRoom(Integer currentUserId, Integer targetUserId) {
        // userId로 user 객체 받기
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("존재하는 회원이 없습니다" + currentUserId));
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("존재하는 회원이 없습니다" + targetUserId));

        // user 둘이 존재하는 채팅방이 있는지 확인
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findByUsersContainsAndUsersContains(currentUser,
                targetUser);
        if (chatRoomOptional.isPresent()) { // 존재하면 채팅방을 반환
            return chatRoomOptional.get();
        } else { // 없으면 새로운 채팅방 생성
            ChatRoom newChatRoom = new ChatRoom();
            Set<User> users = new HashSet<>();
            users.add(currentUser);
            users.add(targetUser);

            newChatRoom.setUsers(users);
            return chatRoomRepository.save(newChatRoom);
        }
    }

    @PreAuthorize("(hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')) &&" +
            "#userId == principal.userId")
    public List<ChatRoom> getChatRooms(Integer userId) {
        return chatRoomRepository.findByUsers_userId(userId);
    }

    @PreAuthorize("(hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')) &&" +
            "#userId == principal.userId")
    public List<ChatRoom> getChatRoomsByLatestMessage(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        return chatRoomRepository.findByUserIdOrderByLatestMessage(user);
    }

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')")
    public List<User> getAvailableUsers() {
        return userRepository.findAll();
    }

}

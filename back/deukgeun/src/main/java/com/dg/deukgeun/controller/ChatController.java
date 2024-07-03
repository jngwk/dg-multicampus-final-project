package com.dg.deukgeun.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.entity.ChatMessage;
import com.dg.deukgeun.entity.ChatRoom;
import com.dg.deukgeun.entity.User;
import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.service.ChatService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // 메세지 발행
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        log.info("=============chat controller: sendMessage=============");
        chatService.sendMessage(chatMessage);
    }

    // 대화 내역 불러오기
    @GetMapping("/history/{chatRoomId}")
    public List<ChatMessage> getChatHistory(@PathVariable Integer chatRoomId) {
        log.info("=============chat controller: getChatHistory=============");
        return chatService.getChatHistory(chatRoomId);
    }

    // 대화방 목록 불러오기
    @GetMapping("/rooms")
    public List<ChatRoom> getChatRooms() {
        log.info("=============chat controller: getChatRooms=============");
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        // return chatService.getChatRooms(userId);
        return chatService.getChatRoomsByLatestMessage(userId);
    }

    // 대화상대 선택시 실행
    @PostMapping("/findOrCreateChatRoom")
    public ChatRoom findOrCreateChatRoom(@RequestBody Map<String, Integer> requestBody) {
        Integer targetUserId = requestBody.get("targetUserId");
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return chatService.findOrCreateChatRoom(userDetails.getUserId(), targetUserId);
    }

    // 대화상대 불러오기
    // TODO 회원과 관련된 헬스장 / 트레이너만 불러오기로 수정
    @GetMapping("/availableUsers")
    public List<User> getAvailableUsers() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Integer userId = userDetails.getUserId();
        List<User> users = chatService.getAvailableUsers(userId);
        return users;
    }

    // 여기부터 아래는 postman 테스팅용

    @PostMapping("/sendMessage")
    public void sendMessageHttp(@RequestBody ChatMessage chatMessage) {
        log.info("=============chat controller: sendMessageHttp=============");
        chatService.sendMessage(chatMessage);
    }

}

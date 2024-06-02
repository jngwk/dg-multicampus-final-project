package com.dg.deukgeun.controller.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.Entity.ChatMessage;
import com.dg.deukgeun.service.chat.ChatService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        log.info("=============chat controller: sendMessage=============");
        chatService.sendMessage(chatMessage);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        log.info("=============chat controller: addUser=============");
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSenderId());
        chatService.sendMessage(chatMessage);
    }

    @GetMapping("/history/{roomId}")
    public List<ChatMessage> getChatHistory(@PathVariable Integer chatRoomId) {
        log.info("=============chat controller: getChatHistory=============");
        return chatService.getChatHistory(chatRoomId);
    }

    // 여기부터 아래는 postman 테스팅용

    @PostMapping("/sendMessage")
    public void sendMessageHttp(@RequestBody ChatMessage chatMessage) {
        log.info("=============chat controller: sendMessageHttp=============");
        chatService.sendMessage(chatMessage);
    }

    @PostMapping("/addUser")
    public void addUserHttp(@RequestBody ChatMessage chatMessage) {
        log.info("=============chat controller: addUserHttp=============");
        chatService.sendMessage(chatMessage);
    }

}

package com.dg.deukgeun.controller.chat;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.Entity.UserEntity;
import com.dg.deukgeun.service.chat.RabbitMQJsonProducer;

@RestController
@RequestMapping("/api/v1")
public class JsonMessageController {
    private RabbitMQJsonProducer jsonProducer;

    public JsonMessageController(RabbitMQJsonProducer jsonProducer) {
        this.jsonProducer = jsonProducer;
    }

    @PostMapping("/publish")
    public ResponseEntity<String> sendJsonMessage(@RequestBody UserEntity user) {
        jsonProducer.sendJsonMessage(user);
        return ResponseEntity.ok("Json message sent to RabbitMQ ...");
    }
}

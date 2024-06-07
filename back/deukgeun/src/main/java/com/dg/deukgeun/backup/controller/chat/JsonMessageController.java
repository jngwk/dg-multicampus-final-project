// package com.dg.deukgeun.backup.controller.chat;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.dg.deukgeun.backup.service.chat.RabbitMQJsonProducer;
// import com.dg.deukgeun.entity.ChatMessage;
// import com.dg.deukgeun.entity.User;

// @RestController
// @RequestMapping("/chat/json")
// public class JsonMessageController {
// private RabbitMQJsonProducer jsonProducer;

// public JsonMessageController(RabbitMQJsonProducer jsonProducer) {
// this.jsonProducer = jsonProducer;
// }

// @PostMapping("/publish")
// public ResponseEntity<String> sendJsonMessage(@RequestBody ChatMessage
// chatMessage) {
// jsonProducer.sendJsonMessage(chatMessage);
// return ResponseEntity.ok("Json message sent to RabbitMQ ...");
// }
// }

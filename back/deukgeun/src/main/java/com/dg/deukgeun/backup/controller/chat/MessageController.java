// package com.dg.deukgeun.backup.controller.chat;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.dg.deukgeun.backup.service.chat.RabbitMQProducer;

// @RestController
// @RequestMapping("/chat")
// public class MessageController {

// private RabbitMQProducer producer;

// public MessageController(RabbitMQProducer producer) {
// this.producer = producer;
// }

// @GetMapping("/publish")
// public ResponseEntity<String> sendMessage(@RequestParam("message") String
// message) {
// producer.sendMessage(message);
// return ResponseEntity.ok("Message sent to RabbitMQ ...");
// }

// }

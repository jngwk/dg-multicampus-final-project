// package com.dg.deukgeun.backup.service.chat;

// import org.springframework.amqp.rabbit.core.RabbitTemplate;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import com.dg.deukgeun.entity.ChatMessage;
// import com.dg.deukgeun.entity.User;

// import lombok.extern.log4j.Log4j2;

// @Log4j2
// @Service
// public class RabbitMQJsonProducer {
// @Value("${rabbitmq.exchange.name}")
// private String exchange;

// @Value("${rabbitmq.routing.json.key}") // dgRoutingJsonKey
// private String routingJsonKey;

// private RabbitTemplate rabbitTemplate;

// public RabbitMQJsonProducer(RabbitTemplate rabbitTemplate) {
// this.rabbitTemplate = rabbitTemplate;
// }

// public void sendJsonMessage(ChatMessage chatMessage) {
// log.info("Json message sent : " + chatMessage);
// rabbitTemplate.convertAndSend(exchange, routingJsonKey, chatMessage);
// }
// }

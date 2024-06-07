// package com.dg.deukgeun.backup.service.chat;

// import org.springframework.amqp.rabbit.annotation.RabbitListener;
// import org.springframework.stereotype.Service;

// import com.dg.deukgeun.entity.ChatMessage;
// import com.dg.deukgeun.entity.User;

// import lombok.extern.log4j.Log4j2;

// @Log4j2
// @Service
// public class RabbitMQJsonConsumer {

// @RabbitListener(queues = { "${rabbitmq.queue.json.name}" })
// public void consumeJsonMessage(ChatMessage chatMessage) {
// log.info("Json message consumed: " + chatMessage);
// }
// }

package com.dg.deukgeun.service.chat;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.UserEntity;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class RabbitMQJsonProducer {
    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.json.key}")
    private String routingJsonKey;

    private RabbitTemplate rabbitTemplate;

    public RabbitMQJsonProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendJsonMessage(UserEntity user) {
        log.info("Json message sent : " + user.toString());
        rabbitTemplate.convertAndSend(exchange, routingJsonKey, user);
    }
}

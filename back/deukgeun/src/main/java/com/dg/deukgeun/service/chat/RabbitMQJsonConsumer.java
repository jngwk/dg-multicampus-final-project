package com.dg.deukgeun.service.chat;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.UserEntity;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class RabbitMQJsonConsumer {

    @RabbitListener(queues = { "${rabbitmq.queue.json.name}" })
    public void consumeJsonMessage(UserEntity user) {
        log.info("Json message consumed: " + user.toString());
    }
}

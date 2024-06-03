package com.dg.deukgeun.backup.service.chat;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.Entity.User;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class RabbitMQJsonConsumer {

    @RabbitListener(queues = { "${rabbitmq.queue.json.name}" })
    public void consumeJsonMessage(User user) {
        log.info("Json message consumed: " + user.toString());
    }
}

package com.dg.deukgeun.service.chat;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class RabbitMQConsumer {

    @RabbitListener(queues = { "${rabbitmq.queue.name}" })
    public void consume(String message) {
        log.info("Recieved message: " + message);

    }
}

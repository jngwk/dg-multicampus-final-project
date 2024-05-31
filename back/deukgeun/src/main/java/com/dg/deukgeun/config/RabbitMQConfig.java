package com.dg.deukgeun.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue chatQueue() {
        return new Queue("chatQueue", false);
    }
}

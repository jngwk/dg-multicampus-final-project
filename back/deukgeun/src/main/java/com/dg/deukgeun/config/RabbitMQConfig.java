package com.dg.deukgeun.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    // 해당 값들을 application.yml에서 정의하여 사용
    @Value("${rabbitmq.queue.name}")
    private String queue;
    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    // rabbit mq queue를 위한 bean 생성
    @Bean
    public Queue queue() {
        return new Queue(queue);
    }

    // rabbit mq exchange를 위한 bean 설정
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    // routing key를 사용해 queue와 exchange를 binding
    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue()) // queue와
                .to(exchange()) // exchange를 binding
                .with(routingKey); // routing key 사용
    }

    // ConnectionFactory, RabbitTemplate, RabbitAdmin은
    // SpringBoot auto configuration에서 자동으로 생성
}

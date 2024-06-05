package com.dg.deukgeun.config;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

// terminal에서 docker command를 사용해 rabbit mq 사용시 command:
// docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3.13.2-management
// management 접속 URL : http://localhost:15672
// 로그인 정보: guest/guest

@Configuration
public class RabbitMQConfig {
    // 해당 값들을 application.yml에서 정의하여 사용
    @Value("${rabbitmq.queue.name}")
    private String queue;
    @Value("${rabbitmq.queue.json.name}")
    private String jsonQueue;
    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;
    @Value("${rabbitmq.routing.json.key}")
    private String routingJsonKey;

    // rabbit mq queue를 위한 bean 생성
    @Bean
    public Queue queue() {
        return new Queue(queue);
    }

    // rabbit mq json 메시지를 위한 queue bean 생성
    @Bean
    public Queue jsonQueue() {
        return new Queue(jsonQueue);
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

    // routing key를 사용해 jsonQueue와 exchange를 binding
    @Bean
    public Binding jsonBinding() {
        return BindingBuilder
                .bind(jsonQueue())
                .to(exchange())
                .with(routingJsonKey);
    }

    // rabbit template을 위한 json 변환 converter bean 생성
    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Handle Java 8 date/time types
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    // json 메시지를 다루는 converter를 갖고있는 template bean 생성
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    // ConnectionFactory, RabbitTemplate, RabbitAdmin은
    // SpringBoot auto configuration에서 자동으로 생성
}

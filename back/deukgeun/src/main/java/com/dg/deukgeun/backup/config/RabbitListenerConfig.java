package com.dg.deukgeun.backup.config;
// package com.dg.deukgeun.config;

// import org.springframework.amqp.rabbit.annotation.RabbitListenerConfigurer;
// import
// org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
// import org.springframework.amqp.rabbit.connection.ConnectionFactory;
// import
// org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistrar;
// import org.springframework.amqp.support.converter.MessageConverter;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import
// org.springframework.messaging.converter.MappingJackson2MessageConverter;
// import
// org.springframework.messaging.handler.annotation.support.DefaultMessageHandlerMethodFactory;

// @Configuration
// public class RabbitListenerConfig implements RabbitListenerConfigurer {

// @Autowired
// private MessageConverter jsonMessageConverter;

// @Autowired
// private ConnectionFactory connectionFactory;

// @Bean
// public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory()
// {
// SimpleRabbitListenerContainerFactory factory = new
// SimpleRabbitListenerContainerFactory();
// factory.setConnectionFactory(connectionFactory);
// factory.setMessageConverter(jsonMessageConverter);
// return factory;
// }

// @Bean
// public DefaultMessageHandlerMethodFactory messageHandlerMethodFactory() {
// DefaultMessageHandlerMethodFactory factory = new
// DefaultMessageHandlerMethodFactory();
// factory.setMessageConverter(jackson2MessageConverter());
// return factory;
// }

// @Bean
// public MappingJackson2MessageConverter jackson2MessageConverter() {
// return new MappingJackson2MessageConverter();
// }

// @Override
// public void configureRabbitListeners(RabbitListenerEndpointRegistrar
// registrar) {
// registrar.setContainerFactory(rabbitListenerContainerFactory());
// }
// }

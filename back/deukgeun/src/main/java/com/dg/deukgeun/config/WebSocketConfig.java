package com.dg.deukgeun.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.security.CustomUserDetailsService;
import com.dg.deukgeun.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lombok.extern.log4j.Log4j2;

@Configuration
@EnableWebSocketMessageBroker
@Log4j2
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // 해당 주소를 구독하고 있는 클라이언트에게 메시지 전달
        config.setApplicationDestinationPrefixes("/pub"); // 해당 주소로 메시지 발신
    }

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000") // SockJS 연결 주소
                .withSockJS();
    }

    @Override
    public boolean configureMessageConverters(@NonNull List<MessageConverter> messageConverters) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // LocalDateTime 값을 받고 보내기 위한 설정
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setObjectMapper(objectMapper);
        messageConverters.add(converter); // JSON 파일 사용 설정
        return false;
    }

    @Override
    public void configureClientInboundChannel(@NonNull ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
                log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Intercepted");

                // 헤더에 접근
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null) {
                    String token = accessor.getFirstNativeHeader("Authorization");
                    log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Token");
                    if (token != null && token.startsWith("Bearer ")) {
                        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Token not null");
                        token = token.substring(7);
                        if (jwtTokenProvider.validateToken(token)) {
                            log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 들어왔다", token);
                            Integer userId = jwtTokenProvider.getUserIdFromToken(token);
                            CustomUserDetails customUserDetails = (CustomUserDetails) customUserDetailsService
                                    .loadUserById(userId);
                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                    customUserDetails, null, customUserDetails.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(auth);
                            accessor.setUser(auth);
                            log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Auth", auth.toString().length());
                        }
                    }
                }
                return message;
            }

            // 쿠키에서 accessToken이라는 이름의 쿠키는 가져옴
            // private String resolveTokenFromCookies(StompHeaderAccessor accessor) {
            // List<String> cookieHeaders = accessor.getNativeHeader("cookie");
            // if (cookieHeaders != null) {
            // for (String header : cookieHeaders) {
            // String[] cookies = header.split("; ");
            // for (String cookie : cookies) {
            // if (cookie.startsWith("accessToken=")) {
            // return cookie.substring("accessToken=".length());
            // }
            // }
            // }
            // }
            // return null;

            // }
        });
    }
}

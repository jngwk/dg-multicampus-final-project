package com.dg.deukgeun.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dg.deukgeun.dto.UserRole;
import com.dg.deukgeun.security.JwtTokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration // Spring 설정 클래스임을 나타냅니다.
@EnableWebSecurity // Spring Security를 활성화합니다.
public class SecurityConfig {

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JWT 토큰을 제공하는 클래스입니다.

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        System.out.println("Security");
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        http
        .csrf(csrf -> csrf.disable()) // CSRF 보호를 비활성화합니다.
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리를 Stateless로 설정합니다.
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/api/user/login", "/api/user/signUp/general","/api/user/signUp", "/api/user/signUp/gym", "/api/user/sendCode").permitAll() // 로그인과 회원가입 API는 인증 없이 접근 가능하도록 설정합니다.
            .requestMatchers("/api/user/userInfo").hasAnyAuthority("ROLE_GENERAL","ROLE_GYM")
            .requestMatchers("/api/user/workoutSession").hasAnyAuthority("ROLE_GENERAL")
            .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN") // ADMIN 역할만 접근할 수 있도록 설정합니다.
            // .requestMatchers("/api/user").permitAll()
            .requestMatchers("/api/membership/stats").hasAuthority("ROLE_GYM")
            .anyRequest().authenticated()) // 그 외 모든 요청은 인증이 필요합니다

        .addFilterBefore(new JwtTokenFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class); // JWT 토큰 필터를 추가합니다.

    return http.build();
    } 

    public static class JwtTokenFilter extends OncePerRequestFilter {

        private final JwtTokenProvider jwtTokenProvider;

        public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
            this.jwtTokenProvider = jwtTokenProvider;
        }

        @Override
        protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
            String token = resolveToken(request); // 요청에서 JWT 토큰을 추출합니다.
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            System.out.println("token : " + token);
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

            if (token != null && jwtTokenProvider.validateToken(token)) { // 토큰이 유효한 경우
                String email = jwtTokenProvider.getEmailFromToken(token); // 토큰에서 이메일을 추출합니다.
                
                request.setAttribute("email", email);
                System.out.println(request.getAttribute("email"));

                UserRole role = jwtTokenProvider.getRoleFromToken(token); // 토큰에서 역할을 추출합니다.
                System.out.println(role);

                Integer userId = jwtTokenProvider.getUserIdFromToken(token);
                System.out.println(userId);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null,
                        Collections.singletonList(new SimpleGrantedAuthority(role.toString()))); // 인증 객체를 생성합니다.
                SecurityContextHolder.getContext().setAuthentication(auth); // 인증 객체를 설정합니다.
            }

             filterChain.doFilter(request, response); // 다음 필터를 호출합니다. 요청당 한번만 실행되도록 필터 실행 제어.
        }

        private String resolveToken(HttpServletRequest request) {
            String jwtToken = request.getHeader("Authorization"); // Authorization 헤더에서 토큰을 가져옵니다.

            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
                return jwtToken.substring(7); // "Bearer " 부분을 제거하고 토큰을 반환합니다.
            }

            return null;
        }
    }
}

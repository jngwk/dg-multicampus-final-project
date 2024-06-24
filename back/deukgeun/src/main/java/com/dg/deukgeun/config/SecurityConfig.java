package com.dg.deukgeun.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dg.deukgeun.security.CustomUserDetails;
import com.dg.deukgeun.security.CustomUserDetailsService;
import com.dg.deukgeun.security.JwtTokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
 백엔드 구현시 Security 관련 참고 사항 :
 
 === 로그인 된 유저 정보 추출 ===

 활용 방법: 

 CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); // 객체 생성을 한 다음
 
 Integer userId = userDetails.getUserId(); // CustomUserDetail의 메소드를 활용해 필요한 정보를 추출

 활용 예시 (UserController > userInfo()) :

    @GetMapping("/userInfo")
    public ResponseDTO<?> getUserInfo() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = userDetails.getUserId();
        return userService.getUserInfo(userId);
    }
        
 ========================================================================================

 === 메소드 권한 설정 ===

 2. Service 레벨 혹은 Controller 레벨에서 method에 권한을 부여해야한다면 Pre/PostAuthentication을 활용
 
 - 메소드 세큐리티 사용을 하면 SecurityConfig 파일에 있는 requestMatchers 생략 가능

 참고 : 일반적으로 Service에서만 사용되는 것 같으며, Controller에서 사용하면 안 되는 것은 아니지만 보안히 많이 강화됨

 활용 예시 (UserService > getUserInfo()):

    @PreAuthorize("hasRole('ROLE_GENERAL') || hasRole('ROLE_GYM') || hasRole('ROLE_TRAINER')")
    public ResponseDTO<UserWithTrainerDTO> getUserInfo(Integer userId) {
        ... 구현 코드
    }
 
 */

@Configuration // Spring 설정 클래스임을 나타냅니다.
@EnableWebSecurity // Spring Security를 활성화합니다.
@EnableMethodSecurity(prePostEnabled = true) // Method Security 사용을 허용
public class SecurityConfig {

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JWT 토큰을 제공하는 클래스입니다.

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 보호를 비활성화합니다.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리를
                                                                                                              // Stateless로
                                                                                                              // 설정합니다.
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/user/login", "/api/qna", "/api/qna/**", "/api/user/logout", "/api/chart",
                                "/api/gym/search/**", "/api/gym/get/**",
                                "/api/gym/getList", "/api/gym/getListWithPaging")
                        .permitAll() // 이 API는 인증 없이 접근 가능하도록 설정합니다.
                        .requestMatchers("/api/user/signUp/gym", "/api/user/signUp/general", "/api/user/sendCode",
                                "/api/gym/crNumberCheck/*", "/api/gym/crNumberCheck", "/api/user/emailCheck/*")
                        .anonymous() // 비회원만 가능
                        .requestMatchers("/api/user/userInfo", "/ws/**")
                        .hasAnyAuthority("ROLE_GENERAL", "ROLE_GYM", "ROLE_TRAINER")
                        .requestMatchers("/api/user/workoutSession/**").hasAnyAuthority("ROLE_GENERAL")
                        .requestMatchers("/api/membership/register").hasAuthority("ROLE_GENERAL")
                        .requestMatchers("/api/membership/stats", "/api/membership/stats/**",
                                "/api/user/signUp/trainer", "/api/trainers/update/**")
                        .hasAnyAuthority("ROLE_GYM")
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/reviews/delete/**", "api/reviews/update/**")
                        .hasAnyAuthority("ROLE_GENERAL", "ROLE_ADMIN")
                        .requestMatchers("/api/reviews/registerReview").hasAuthority("ROLE_GENERAL")
                        .requestMatchers("/api/reviews/reviewList/**").permitAll()
                        .requestMatchers("/api/trainers/update/**").hasAuthority("ROLE_TRAINER")
                        .anyRequest().authenticated()) // 그 외 모든 요청은 인증이 필요합니다

                .addFilterBefore(new JwtTokenFilter(jwtTokenProvider, customUserDetailsService),
                        UsernamePasswordAuthenticationFilter.class); // JWT 토큰 필터를 추가합니다.

        return http.build();
    }

    public static class JwtTokenFilter extends OncePerRequestFilter {

        private final JwtTokenProvider jwtTokenProvider;

        private final CustomUserDetailsService customUserDetailsService;

        public JwtTokenFilter(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService customUserDetailsService) {
            this.jwtTokenProvider = jwtTokenProvider;
            this.customUserDetailsService = customUserDetailsService;
        }

        @Override
        protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                @NonNull FilterChain filterChain) throws ServletException, IOException {
            String token = resolveToken(request); // 요청에서 JWT 토큰을 추출합니다.

            if (token != null && jwtTokenProvider.validateToken(token)) {
                Integer userId = jwtTokenProvider.getUserIdFromToken(token); // userId만 추출

                /*
                 * userId로 만든 detailsService를 사용해 customUserDetails를 정의
                 * 이렇게하면 request attribute에 정보를 저장하지 않아도 돼 보안이 강화됨
                 */
                CustomUserDetails customUserDetails = (CustomUserDetails) customUserDetailsService.loadUserById(userId);

                // principal을 customUserDetails로 정의하여 SecurityContextHolder를 체이닝 메소딩해서 사용 가능
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        customUserDetails, null, customUserDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

            // if (token != null && jwtTokenProvider.validateToken(token)) { // 토큰이 유효한 경우

            // String email = jwtTokenProvider.getEmailFromToken(token); // 토큰에서 이메일을 추출합니다.
            // request.setAttribute("email", email);
            // System.out.println(request.getAttribute("email"));

            // UserRole role = jwtTokenProvider.getRoleFromToken(token); // 토큰에서 역할을 추출합니다.
            // request.setAttribute("role", role);
            // System.out.println(role);

            // Integer userId = jwtTokenProvider.getUserIdFromToken(token); // 토큰에서 userId를
            // 추출합니다.
            // request.setAttribute("userId", userId);
            // System.out.println(userId);

            // String userName = jwtTokenProvider.getUserNameFromToken(token); // 토큰에서
            // userId를 추출합니다.
            // request.setAttribute("userName", userName);
            // System.out.println(userName);

            // UsernamePasswordAuthenticationToken auth = new
            // UsernamePasswordAuthenticationToken(email, null,
            // Collections.singletonList(new SimpleGrantedAuthority(role.toString()))); //
            // 인증 객체를 생성합니다.
            // SecurityContextHolder.getContext().setAuthentication(auth); // 인증 객체를 설정합니다.
            // }

            filterChain.doFilter(request, response); // 다음 필터를 호출합니다. 요청당 한번만 실행되도록 필터 실행 제어.
        }

        private String resolveToken(HttpServletRequest request) {
            Cookie[] cookies = request.getCookies(); // 쿠키에서 토큰 추출

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("accessToken".equals(cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }

            return null;
        }
    }
}

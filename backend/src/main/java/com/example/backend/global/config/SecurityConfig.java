package com.example.backend.global.config;

import com.example.backend.global.security.filter.JwtAuthFilter;
import com.example.backend.global.security.handler.CustomAccessDenied;
import com.example.backend.global.security.handler.CustomEntryPoint;
import com.example.backend.global.security.handler.OAuthSuccessHandler;
import com.example.backend.global.security.service.CustomOAuthService;
import com.example.backend.global.security.service.CustomMemberDetailsService;
import com.example.backend.global.security.service.TokenService;
import com.example.backend.global.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Spring Security 설정 활성화
@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final CustomMemberDetailsService customMemberDetailsService;
    private final CustomOAuthService customOAuthService;
    private final TokenService tokenService;

    private final String [] publicUris = {
            "/auth/sign-up",
            "/auth/login",
            "/auth/reissue",
            "/oauth/authorize/**",
            "/oauth/callback/**",
            "/login/oauth2/code/**",
            "/api/maids/login",
            "/api/maids/signup",
            "/api/cafes/v1/home",
            "/api/cafes/v1/*"
    };

    private final String [] swaggerUris = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-resources/**",
    };

    // SecurityFilterChain 정의 및 HttpSecurity 객체를 통한 여러 보안 설정 구성
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomOAuthService customOAuthService) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)

                // HTTP 요청에 대한 접근 제어 설정
                .authorizeHttpRequests(requests -> requests
                        // Public API 허용
                        .requestMatchers(swaggerUris).permitAll()
                        .requestMatchers(publicUris).permitAll()

                        // 인가 실패 테스트용
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                // 폼 로그인에 대한 설정
                .formLogin(AbstractHttpConfigurer::disable)

                // 세션
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                // JWT 필터
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class)

                // 로그아웃처리에 대한 설정
                // /logout 경로로 로그아웃을 처리
                // 로그아웃 성공 시 /login?logout으로 리다이렉트
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                )

                // OAuth
                .oauth2Login(oauth -> oauth

                        // 인증 엔트리 포인트
                        .authorizationEndpoint(auth -> auth
                                .baseUri("/oauth/authorize")
                        )
                        // 콜백 주소
                        .redirectionEndpoint(redirect -> redirect
                                .baseUri("/oauth/callback/**")
                        )
                        // 인증 완료 후 정보 활용
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuthService)
                        )
                        // 성공 시 JWT 토큰 발생할 핸들러
                        .successHandler(oAuthSuccessHandler())
                )


                // 예외 상황 핸들러
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(customAccessDenied())
                        .authenticationEntryPoint(customEntryPoint())
                )
        ;

        return http.build();
    }

    // 비밀번호 솔트를 위한 BCrypt를 PasswordEncoder로 설정 가능
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomAccessDenied customAccessDenied() {
        return new CustomAccessDenied();
    }

    @Bean
    public CustomEntryPoint customEntryPoint() {
        return new CustomEntryPoint();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtUtil, customMemberDetailsService);
    }

    @Bean
    public OAuthSuccessHandler oAuthSuccessHandler() {
        return new OAuthSuccessHandler(tokenService);
    }
}

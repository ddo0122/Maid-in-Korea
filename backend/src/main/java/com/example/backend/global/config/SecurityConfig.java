package com.example.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// Spring Security 설정 활성화
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final String[] allowUris = {
            // Swagger 허용
            "/swagger-ui/**",
            "/swagger-resources/**",
            "/v3/api-docs/**",

            // 로그인
            "/auth/**"
    };

    // SecurityFilterChain 정의 및 HttpSecurity 객체를 통한 여러 보안 설정 구성
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                // HTTP 요청에 대한 접근 제어 설정
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(allowUris).permitAll() // 메소드를 사용해 특정 URL 패턴에 대한 접근 권한 설정, 인증 없이 접근 가능한 경로 지정
                        .anyRequest().authenticated() // 그 외 모든 요청에 대한 인증 요구
                )
                // 폼 로그인에 대한 설정
                // 성공 시 /swagger-ui/index.html 로 리다이렉트, alwaysUse를 true로 설정 시 로그인 성공 시 항상 Swagger로 리다이렉트
                // 로그인 페이지는 모든 사용자가 접근 가능하도록 설정
                .formLogin(form -> form
                        .defaultSuccessUrl("/swagger-ui.html", true)
                        .permitAll()
                )

                // 로그아웃처리에 대한 설정
                // /logout 경로로 로그아웃을 처리
                // 로그아웃 성공 시 /login?logout으로 리다이렉트
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );

        return http.build();
    }

    // 비밀번호 솔트를 위한 BCrypt를 PasswordEncoder로 설정 가능
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

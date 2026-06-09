package com.example.backend.global.security.filter;

import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.code.GeneralErrorCode;
import com.example.backend.global.security.service.CustomAdminDetailsService;
import com.example.backend.global.security.service.CustomMemberDetailsService;
import com.example.backend.global.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomMemberDetailsService customMemberDetailsService;
    private final CustomAdminDetailsService customAdminDetailsService;

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            // 토큰 가져오기
            String token = request.getHeader("Authorization");

            // 토큰이 없거나 Bearer가 아니면 넘기기
            if(token == null || !token.startsWith("Bearer ")){
                filterChain.doFilter(request, response);
                return;
            }

            // Bearer이면 추출
            token = token.replace("Bearer ", "");

            // AccessToken 검증하기: 올바를 토큰의 경우
            if(jwtUtil.isValid(token, JwtUtil.ACCESS_TOKEN_TYPE)){

                UserDetails user;
                String subjectType = jwtUtil.getSubjectType(token);
                if (JwtUtil.ADMIN_SUBJECT_TYPE.equals(subjectType)) {
                    Long adminId = jwtUtil.getAdminId(token);
                    user = customAdminDetailsService.loadUserById(adminId);
                } else {
                    Long memberId = jwtUtil.getMemberId(token);
                    user = customMemberDetailsService.loadUserById(memberId);
                }

                Authentication auth = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );

                // 인증 완료 후 SecurityContextHolder에 넣기
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
            filterChain.doFilter(request, response);
        } catch (Exception e){
            ObjectMapper mapper = new ObjectMapper();
            BaseErrorCode code = GeneralErrorCode.UNAUTHORIZED;

            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(code.getStatus().value());

            ApiResponse<Void> errorResponse = ApiResponse.onFailure(code, null);

            mapper.writeValue(response.getOutputStream(), errorResponse);
        }
    }

}

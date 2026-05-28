package com.example.backend.global.security.util;

import com.example.backend.domain.member.enums.SocialType;
import com.example.backend.global.security.entity.AuthMember;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final Duration accessExpiration;

    public JwtUtil(
            @Value("${jwt.token.secretKey}") String secret,
            @Value("${jwt.token.expiration.access}") Long accessExpiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = Duration.ofMillis(accessExpiration);
    }

    // AccessToken 생성
    public String createAccessToken(AuthMember member) {
        return createToken(member, accessExpiration);
    }

//    /** 토큰에서 이메일 가져오기
//     *
//     * @param token 유저 정보를 추출할 토큰
//     * @return 유저 이메일을 토큰에서 추출합니다
//     */
//    public String getEmail(String token) {
//        try {
//            return getClaims(token).getPayload().getSubject(); // Parsing해서 Subject 가져오기
//        } catch (JwtException e) {
//            return null;
//        }
//    }

    /** 토큰에서 uid 가져오기
     * @param token 유저 정보를 추출할 토큰
     * @return 유저 uid를 추출합니다.
     */

//    public String getUid(String token) {
//        try {
//            return getClaims(token).getPayload().getSubject();
//        } catch (Exception e) {
//            return null;
//        }
//    }
//
//    /** 토큰에서 소셜 로그인 타입 가져오기
//     * @param token 유저 정보를 추출할 토큰
//     * @return 유저 소셜 로그인 타입을 추출합니다.
//     */
//
//    public SocialType getSocialType(String token) {
//        try {
//            return SocialType.valueOf(getClaims(token).getPayload().get("social_type").toString().toUpperCase());
//        } catch (Exception e) {
//            return null;
//        }
//    }

    /** 토큰에서 member ID 가져오기
     * @param token 유저 정보를 추출할 토큰
     * @return Member ID를 가져옵니다.
     */

    public Long getMemberId(String token) {
        try {
            return Long.valueOf(getClaims(token).getPayload().getSubject());
        } catch (Exception e) {
            return null;
        }
    }

    /** 토큰 유효성 확인
     * @param token 유효한지 확인할 토큰
     * @return True, False 반환합니다
     */
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    // 토큰 생성
    private String createToken(AuthMember member, Duration expiration) {
        Instant now = Instant.now();

        // 인가 정보
        String authorities = member.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(member.getMember().getId().toString()) // User Uid를 Subject로
                .claim("role", authorities)
                .issuedAt(Date.from(now)) // 언제 발급한지
                .expiration(Date.from(now.plus(expiration))) // 언제까지 유효한지
                .signWith(secretKey)
                .compact();
    }

    // 토큰 정보 가져오기
    private Jws<Claims> getClaims(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(secretKey)
                .clockSkewSeconds(60)
                .build()
                .parseSignedClaims(token);
    }

}

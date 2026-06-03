package com.example.backend.global.security.service;

import com.example.backend.domain.member.entity.Member;
import com.example.backend.domain.member.exception.MemberException;
import com.example.backend.domain.member.exception.code.MemberErrorCode;
import com.example.backend.domain.member.repository.MemberRepository;
import com.example.backend.global.security.dto.TokenDTO;
import com.example.backend.global.security.entity.AuthMember;
import com.example.backend.global.security.exception.TokenException;
import com.example.backend.global.security.exception.code.TokenErrorCode;
import com.example.backend.global.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenService {

    private static final String REFRESH_TOKEN_KEY_PREFIX = "refresh:";
    private static final DefaultRedisScript<Long> CONSUME_REFRESH_TOKEN_SCRIPT =
            new DefaultRedisScript<>("""
                    if redis.call('get', KEYS[1]) == ARGV[1] then
                        return redis.call('del', KEYS[1])
                    end
                    return 0
                    """, Long.class);

    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final MemberRepository memberRepository;

    public TokenDTO.TokenPair issue(Member member) {
        AuthMember authMember = new AuthMember(member);
        String accessToken = jwtUtil.createAccessToken(authMember);
        String refreshToken = jwtUtil.createRefreshToken(authMember);

        redisTemplate.opsForValue().set(
                getRefreshTokenKey(member.getId()),
                hash(refreshToken),
                jwtUtil.getRefreshExpiration()
        );

        return TokenDTO.TokenPair.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }

    public TokenDTO.TokenPair rotate(String refreshToken) {
        if (!jwtUtil.isValid(refreshToken, JwtUtil.REFRESH_TOKEN_TYPE)) {
            throw new TokenException(TokenErrorCode.INVALID_REFRESH_TOKEN);
        }

        Long memberId = jwtUtil.getMemberId(refreshToken);
        Member member = memberRepository.findByIdAndDeletedAtIsNull(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.USER_NOT_FOUND));

        Long consumed = redisTemplate.execute(
                CONSUME_REFRESH_TOKEN_SCRIPT,
                List.of(getRefreshTokenKey(memberId)),
                hash(refreshToken)
        );

        if (consumed == null || consumed == 0) {
            throw new TokenException(TokenErrorCode.INVALID_REFRESH_TOKEN);
        }

        return issue(member);
    }

    private String getRefreshTokenKey(Long memberId) {
        return REFRESH_TOKEN_KEY_PREFIX + memberId;
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm is not available.", e);
        }
    }
}

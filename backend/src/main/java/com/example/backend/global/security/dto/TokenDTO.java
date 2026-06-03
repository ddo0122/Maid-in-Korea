package com.example.backend.global.security.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

public class TokenDTO {

    public record Reissue(
            @NotBlank(message = "Refresh Token 입력은 필수입니다.")
            String refreshToken
    ) {}

    @Builder
    public record TokenPair(
            String accessToken,
            String refreshToken,
            String tokenType
    ) {}
}

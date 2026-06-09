package com.example.backend.domain.admin.dto;

import lombok.Builder;

public class AdminResDTO {

    @Builder
    public record Login(
            String accessToken,
            String refreshToken,
            String tokenType
    ) {}
}

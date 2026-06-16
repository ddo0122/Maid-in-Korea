package com.example.backend.domain.maid.dto;

import com.example.backend.domain.maid.entity.Maid;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

public class MaidResDTO {

    @Builder
    public record Signup(
            String accessToken,
            String tokenType
    ) {}

    @Builder
    public record Login(
            String accessToken,
            String tokenType
    ) {}

    @Builder
    public record Profiles(
            Long profileId,
            String name,
            String description,
            String serviceArea,
            String instagram,
            String x,
            Boolean isActive
    ) {}
}

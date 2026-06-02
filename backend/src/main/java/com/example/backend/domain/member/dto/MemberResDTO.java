package com.example.backend.domain.member.dto;

import lombok.Builder;

public class MemberResDTO {

    @Builder
    public record MemberInfo(
            String name,
            String email,
            String birth,
            String address,
            String detailAddress
    ){}

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

}

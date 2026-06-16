package com.example.backend.domain.admin.dto;

import lombok.Builder;

import java.util.List;

public class AdminResDTO {

    @Builder
    public record Login(
            String accessToken,
            String refreshToken,
            String tokenType
    ) {}

    @Builder
    public record Me(
            Long adminId,
            String loginId,
            Long cafeId,
            CafeInfo cafe
    ) {}

    @Builder
    public record CafeInfo(
            Long cafeId,
            String name,
            String description,
            String location,
            String phone,
            String website,
            String defaultOpenTime,
            String defaultCloseTime,
            String defaultLastOrderTime,
            String regularClosedDays,
            List<MenuInfo> menus
    ) {}

    @Builder
    public record MenuInfo(
            Long menuId,
            String name,
            Integer price,
            String image
    ) {}
}

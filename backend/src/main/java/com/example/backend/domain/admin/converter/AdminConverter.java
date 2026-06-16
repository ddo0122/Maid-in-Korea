package com.example.backend.domain.admin.converter;

import com.example.backend.domain.admin.dto.AdminResDTO;
import com.example.backend.domain.admin.entity.Admin;
import com.example.backend.domain.cafe.dto.CafeReqDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.Menu;
import com.example.backend.global.security.dto.TokenDTO;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class AdminConverter {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public static AdminResDTO.Login toLogin(
            TokenDTO.TokenPair tokenPair
    ) {
        return AdminResDTO.Login.builder()
                .accessToken(tokenPair.accessToken())
                .refreshToken(tokenPair.refreshToken())
                .tokenType(tokenPair.tokenType())
                .build();
    }

    public static AdminResDTO.Me toMe(
            Admin admin
    ) {
        Cafe cafe = admin.getCafe();

        return AdminResDTO.Me.builder()
                .adminId(admin.getId())
                .loginId(admin.getLoginId())
                .cafeId(cafe.getId())
                .cafe(toCafeInfo(cafe))
                .build();
    }

    public static void patchMenu(
            Menu menu,
            CafeReqDTO.UpdateMenu dto
    ) {
        menu.patchInfo(dto.name(), dto.price(), dto.image());
    }

    public static Menu toMenu(
            Cafe cafe,
            CafeReqDTO.CreateMenu dto
    ) {
        return Menu.builder()
                .cafe(cafe)
                .name(dto.name().trim())
                .price(dto.price())
                .image(trimNullable(dto.image()))
                .build();
    }

    private static AdminResDTO.CafeInfo toCafeInfo(
            Cafe cafe
    ) {
        return AdminResDTO.CafeInfo.builder()
                .cafeId(cafe.getId())
                .name(cafe.getName())
                .description(cafe.getDescription())
                .location(cafe.getLocation())
                .phone(cafe.getPhone())
                .website(cafe.getWebsite())
                .defaultOpenTime(formatTime(cafe.getDefaultOpenTime()))
                .defaultCloseTime(formatTime(cafe.getDefaultCloseTime()))
                .defaultLastOrderTime(formatTime(cafe.getDefaultLastOrderTime()))
                .regularClosedDays(cafe.getRegularClosedDays())
                .menus(toMenuInfos(cafe.getMenus()))
                .build();
    }

    private static List<AdminResDTO.MenuInfo> toMenuInfos(
            List<Menu> menus
    ) {
        return menus.stream()
                .map(menu -> AdminResDTO.MenuInfo.builder()
                        .menuId(menu.getId())
                        .name(menu.getName())
                        .price(menu.getPrice())
                        .image(menu.getImage())
                        .build())
                .toList();
    }

    private static String formatTime(
            LocalTime time
    ) {
        return time != null ? time.format(TIME_FORMATTER) : null;
    }

    private static String trimNullable(
            String value
    ) {
        return value != null ? value.trim() : null;
    }
}

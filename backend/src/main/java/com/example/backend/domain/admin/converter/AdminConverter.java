package com.example.backend.domain.admin.converter;

import com.example.backend.domain.admin.dto.AdminReqDTO;
import com.example.backend.domain.admin.dto.AdminResDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.global.security.dto.TokenDTO;

public class AdminConverter {

    public static AdminResDTO.Login toLogin(
            TokenDTO.TokenPair tokenPair
    ) {
        return AdminResDTO.Login.builder()
                .accessToken(tokenPair.accessToken())
                .refreshToken(tokenPair.refreshToken())
                .tokenType(tokenPair.tokenType())
                .build();
    }

    public static Cafe patchCafe(
            Cafe cafe,
            AdminReqDTO.UpdateCafe dto
    ) {
        cafe.patchAdminCafeInfo(
                trimNullable(dto.name()),
                trimNullable(dto.description()),
                trimNullable(dto.phone()),
                trimNullable(dto.website()),
                dto.defaultOpenTime(),
                dto.defaultCloseTime(),
                dto.defaultLastOrderTime(),
                trimNullable(dto.regularClosedDays())
        );
        return cafe;
    }

    private static String trimNullable(
            String value
    ) {
        return value != null ? value.trim() : null;
    }
}

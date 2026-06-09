package com.example.backend.domain.admin.exception.code;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AdminErrorCode implements BaseErrorCode {

    ADMIN_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "ADMIN404_1",
            "해당 관리자를 찾을 수 없습니다."
    ),
    INVALID_PASSWORD(
            HttpStatus.UNAUTHORIZED,
            "ADMIN401_1",
            "관리자 비밀번호가 올바르지 않습니다."
    ),
    FORBIDDEN_ADMIN_ONLY(
            HttpStatus.FORBIDDEN,
            "ADMIN403_1",
            "관리자만 접근할 수 있습니다."
    ),
    ADMIN_CAFE_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "ADMIN404_2",
            "관리자에게 매핑된 카페를 찾을 수 없습니다."
    ),
    INVALID_CAFE_INFO(
            HttpStatus.BAD_REQUEST,
            "ADMIN400_1",
            "카페 정보가 올바르지 않습니다."
    ),
    CAFE_ALREADY_MAPPED(
            HttpStatus.CONFLICT,
            "ADMIN409_1",
            "이미 관리자 계정에 매핑된 카페입니다."
    ),
    LOGIN_ID_ALREADY_EXISTS(
            HttpStatus.CONFLICT,
            "ADMIN409_2",
            "이미 사용 중인 관리자 아이디입니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}

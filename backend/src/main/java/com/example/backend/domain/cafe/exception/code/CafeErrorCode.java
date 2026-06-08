package com.example.backend.domain.cafe.exception.code;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CafeErrorCode implements BaseErrorCode {

    CAFE_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CAFE404_1",
            "요청하신 카페를 찾을 수 없습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}

package com.example.backend.global.security.exception.code;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TokenErrorCode implements BaseErrorCode {

    INVALID_REFRESH_TOKEN(
            HttpStatus.UNAUTHORIZED,
            "TOKEN401_1",
            "Refresh Token이 유효하지 않습니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}

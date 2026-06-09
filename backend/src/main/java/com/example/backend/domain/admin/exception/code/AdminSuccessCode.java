package com.example.backend.domain.admin.exception.code;

import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AdminSuccessCode implements BaseSuccessCode {

    OK(
            HttpStatus.OK,
            "ADMIN200_1",
            "성공적으로 관리자 요청을 처리했습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}

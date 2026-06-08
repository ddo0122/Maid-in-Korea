package com.example.backend.domain.cafe.exception.code;

import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CafeSuccessCode implements BaseSuccessCode {

    HOME_CAFES_OK(
            HttpStatus.OK,
            "CAFE200_1",
            "홈 카페 목록 조회에 성공했습니다."
    ),

    DETAIL_OK(
            HttpStatus.OK,
            "CAFE200_2",
            "카페 상세 조회에 성공했습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}

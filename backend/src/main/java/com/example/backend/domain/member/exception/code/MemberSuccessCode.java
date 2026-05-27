package com.example.backend.domain.member.exception.code;

import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberSuccessCode implements BaseSuccessCode {

    OK(HttpStatus.OK,
            "USER200_1",
            "성공적으로 사용자 요청을 처리했습니다."),
    CREATED(HttpStatus.CREATED,
            "USER201_1",
            "회원가입이 성공적으로 완료되었습니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}

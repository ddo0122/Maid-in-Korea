package com.example.backend.domain.member.exception.code;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberErrorCode implements BaseErrorCode {

    INVALID_USER_INFO(
            HttpStatus.BAD_REQUEST,
            "USER400_1",
            "사용자 정보가 올바르지 않습니다."),
    NOT_SUPPORT_SOCIAL_PROVIDER(
            HttpStatus.BAD_REQUEST,
            "USER400_2",
            "지원하지 않는 소셜 로그인입니다."
    ),
    INVALID_PASSWORD(
            HttpStatus.UNAUTHORIZED,
            "USER401_1",
            "비밀번호가 올바르지 않습니다."
    ),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,
            "USER404_1",
            "해당 사용자를 찾을 수 없습니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT,
            "USER409_1",
            "이미 가입된 이메일입니다.")
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}

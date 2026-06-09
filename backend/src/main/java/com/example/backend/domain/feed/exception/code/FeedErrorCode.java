package com.example.backend.domain.feed.exception.code;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum FeedErrorCode implements BaseErrorCode {

    INVALID_MEMBER_INFO(
            HttpStatus.BAD_REQUEST,
            "FEED400_1",
            "회원 정보가 올바르지 않습니다."
    ),
    UNAUTHORIZED_MEMBER(
            HttpStatus.UNAUTHORIZED,
            "FEED401_1",
            "로그인이 필요한 요청입니다."
    ),
    FORBIDDEN_MAID_ONLY(
            HttpStatus.FORBIDDEN,
            "FEED403_1",
            "메이드 계정만 피드를 작성할 수 있습니다."
    ),
    PROFILE_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "FEED404_1",
            "피드를 작성할 메이드 프로필을 찾을 수 없습니다."
    ),
    FEED_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "FEED404_2",
            "요청하신 피드를 찾을 수 없습니다."
    ),
    FORBIDDEN_FEED_OWNER_ONLY(
            HttpStatus.FORBIDDEN,
            "FEED403_2",
            "피드 작성자만 수정할 수 있습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}

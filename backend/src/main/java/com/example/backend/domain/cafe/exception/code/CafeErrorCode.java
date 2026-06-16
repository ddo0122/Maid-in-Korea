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
    ),
    MONTHLY_SCHEDULE_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CAFE404_2",
            "요청하신 월간 스케줄을 찾을 수 없습니다."
    ),
    MENU_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CAFE404_3",
            "요청하신 메뉴를 찾을 수 없습니다."
    ),
    MAID_INVITATION_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CAFE404_4",
            "요청하신 메이드 초대 요청을 찾을 수 없습니다."
    ),
    INVALID_MONTHLY_SCHEDULE(
            HttpStatus.BAD_REQUEST,
            "CAFE400_1",
            "월간 스케줄 정보가 올바르지 않습니다."
    ),
    INVALID_MENU_INFO(
            HttpStatus.BAD_REQUEST,
            "CAFE400_3",
            "메뉴 정보가 올바르지 않습니다."
    ),
    DUPLICATED_SCHEDULE_DATE(
            HttpStatus.CONFLICT,
            "CAFE409_1",
            "중복된 스케줄 날짜가 존재합니다."
    ),
    DUPLICATED_SCHEDULE_MAID(
            HttpStatus.CONFLICT,
            "CAFE409_2",
            "같은 날짜에 중복 등록된 메이드가 존재합니다."
    ),
    CAFE_MAID_ALREADY_EXISTS(
            HttpStatus.CONFLICT,
            "CAFE409_3",
            "이미 카페에 등록된 메이드 프로필입니다."
    ),
    DUPLICATED_MAID_INVITATION(
            HttpStatus.CONFLICT,
            "CAFE409_4",
            "이미 대기 중인 메이드 초대 요청이 존재합니다."
    ),
    MAID_PROFILE_NOT_IN_CAFE(
            HttpStatus.BAD_REQUEST,
            "CAFE400_2",
            "해당 카페 소속이 아닌 메이드 프로필이 포함되어 있습니다."
    ),
    INVALID_MAID_INVITATION_STATUS(
            HttpStatus.BAD_REQUEST,
            "CAFE400_4",
            "처리할 수 없는 메이드 초대 요청입니다."
    ),
    INVALID_CURSOR(
            HttpStatus.BAD_REQUEST,
            "CAFE400_5",
            "커서 정보가 올바르지 않습니다."
    ),
    FORBIDDEN_MAID_INVITATION(
            HttpStatus.FORBIDDEN,
            "CAFE403_1",
            "해당 메이드 초대 요청을 처리할 권한이 없습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}

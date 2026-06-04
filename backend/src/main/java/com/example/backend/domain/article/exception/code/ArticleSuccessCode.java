package com.example.backend.domain.article.exception.code;

import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ArticleSuccessCode implements BaseSuccessCode {

    OK(HttpStatus.OK,
            "ARTICLE200_1",
            "게시글 조회에 성공했습니다."),

    CREATED(HttpStatus.CREATED,
            "ARTICLE201_1",
            "게시글이 성공적으로 작성되었습니다."),

    UPDATED(HttpStatus.OK,
            "ARTICLE200_2",
            "게시글이 성공적으로 수정되었습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}

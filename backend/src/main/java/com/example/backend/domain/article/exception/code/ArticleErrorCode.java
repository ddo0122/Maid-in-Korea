package com.example.backend.domain.article.exception.code;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ArticleErrorCode implements BaseErrorCode {


    INVALID_CURSOR(
            HttpStatus.BAD_REQUEST,
            "ARTICLE400_1",
            "잘못된 커서 값입니다."
    ),

    FORBIDDEN_ARTICLE_OWNER_ONLY(
            HttpStatus.FORBIDDEN,
            "ARTICLE403_1",
            "게시글 작성자만 수정 또는 삭제할 수 있습니다."
    ),

    ARTICLE_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "ARTICLE404_1",
            "요청하신 글을 찾을 수 없습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}

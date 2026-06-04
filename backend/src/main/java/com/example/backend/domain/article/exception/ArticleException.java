package com.example.backend.domain.article.exception;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.exception.ProjectException;

public class ArticleException extends ProjectException {
    public ArticleException(BaseErrorCode errorCode) {
        super(errorCode);
    }
}

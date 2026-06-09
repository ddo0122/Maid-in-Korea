package com.example.backend.domain.feed.exception;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.exception.ProjectException;

public class FeedException extends ProjectException {
    public FeedException(BaseErrorCode errorCode) {
        super(errorCode);
    }
}

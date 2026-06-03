package com.example.backend.global.security.exception;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.exception.ProjectException;

public class TokenException extends ProjectException {
    public TokenException(BaseErrorCode errorCode) {
        super(errorCode);
    }
}

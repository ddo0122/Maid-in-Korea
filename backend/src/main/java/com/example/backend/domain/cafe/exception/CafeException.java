package com.example.backend.domain.cafe.exception;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.exception.ProjectException;

public class CafeException extends ProjectException {
    public CafeException(BaseErrorCode errorCode) {
        super(errorCode);
    }
}

package com.example.backend.domain.maid.exception;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.exception.ProjectException;

public class MaidException extends ProjectException {
    public MaidException(BaseErrorCode errorCode) {
        super(errorCode);
    }
}

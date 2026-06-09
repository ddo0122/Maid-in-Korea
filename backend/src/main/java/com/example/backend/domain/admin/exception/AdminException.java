package com.example.backend.domain.admin.exception;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.exception.ProjectException;

public class AdminException extends ProjectException {
    public AdminException(BaseErrorCode errorCode) {
        super(errorCode);
    }
}

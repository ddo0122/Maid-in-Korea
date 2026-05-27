package com.example.backend.domain.member.exception;

import com.example.backend.global.apiPayload.code.BaseErrorCode;
import com.example.backend.global.apiPayload.exception.ProjectException;

public class MemberException extends ProjectException {
    public MemberException(BaseErrorCode errorCode) {
        super(errorCode);
    }
}

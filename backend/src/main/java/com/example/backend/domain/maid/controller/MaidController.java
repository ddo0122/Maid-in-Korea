package com.example.backend.domain.maid.controller;

import com.example.backend.domain.maid.dto.MaidReqDTO;
import com.example.backend.domain.maid.dto.MaidResDTO;
import com.example.backend.domain.maid.exception.code.MaidSuccessCode;
import com.example.backend.domain.maid.service.MaidService;
import com.example.backend.domain.member.dto.MemberReqDTO;
import com.example.backend.domain.member.dto.MemberResDTO;
import com.example.backend.domain.member.service.MemberService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maids")
@RequiredArgsConstructor
public class MaidController {

    private final MaidService maidService;
    private final MemberService memberService;

    @PostMapping("/signup")
    public ApiResponse<MemberResDTO.Signup> signup(
            @Valid @RequestBody MemberReqDTO.SignupInfo dto
    ) {
        BaseSuccessCode code = MaidSuccessCode.CREATED;
        return ApiResponse.onSuccess(code, memberService.maidSignup(dto));
    }

    @PostMapping("/login")
    public ApiResponse<MemberResDTO.Login> login(
            @Valid @RequestBody MemberReqDTO.Login dto
    ) {
        BaseSuccessCode code = MaidSuccessCode.OK;
        return ApiResponse.onSuccess(code, memberService.maidLogin(dto));
    }
}

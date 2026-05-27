package com.example.backend.domain.member.controller;

import com.example.backend.domain.member.dto.MemberReqDTO;
import com.example.backend.domain.member.dto.MemberResDTO;
import com.example.backend.domain.member.exception.code.MemberSuccessCode;
import com.example.backend.domain.member.service.MemberService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import com.example.backend.global.security.entity.AuthMember;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 토큰을 매개변수로 하는 인증로직
    @GetMapping("/v2/users/me")
    public ApiResponse<MemberResDTO.MemberInfo> getUserInfo(
            @AuthenticationPrincipal AuthMember member
    ){
        BaseSuccessCode code = MemberSuccessCode.OK;
        return ApiResponse.onSuccess(code, memberService.getMemberInfo(member));
    }

    @PostMapping("login")
    public ApiResponse<MemberResDTO.Login> login(
            @RequestBody @Valid MemberReqDTO.Login dto
    ) {
        BaseSuccessCode code = MemberSuccessCode.OK;
        return ApiResponse.onSuccess(code, memberService.login(dto));
    }

    @PostMapping("/sign-up")
    public ApiResponse<MemberResDTO.Signup> signUp(
            @Valid @RequestBody MemberReqDTO.SignupInfo dto
    ) {
        BaseSuccessCode code = MemberSuccessCode.CREATED;
        return ApiResponse.onSuccess(code, memberService.signup(dto));
    }
}

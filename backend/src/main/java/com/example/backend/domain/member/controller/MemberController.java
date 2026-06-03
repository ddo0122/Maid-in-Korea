package com.example.backend.domain.member.controller;

import com.example.backend.domain.member.dto.MemberReqDTO;
import com.example.backend.domain.member.dto.MemberResDTO;
import com.example.backend.domain.member.exception.code.MemberSuccessCode;
import com.example.backend.domain.member.service.MemberService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import com.example.backend.global.security.dto.TokenDTO;
import com.example.backend.global.security.entity.AuthMember;
import com.example.backend.global.security.service.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final TokenService tokenService;

    @GetMapping("/v2/members/me")
    public ApiResponse<MemberResDTO.MemberInfo> getUserInfo(
            @AuthenticationPrincipal AuthMember member
    ){
        BaseSuccessCode code = MemberSuccessCode.OK;
        return ApiResponse.onSuccess(code, memberService.getMemberInfo(member));
    }

    @PatchMapping("/v1/members/update")
    public ApiResponse<Void> updateUserInfo(
            @AuthenticationPrincipal AuthMember member,
            @RequestBody @Valid MemberReqDTO.UpdateInfo dto
    ) {
        BaseSuccessCode code = MemberSuccessCode.OK;
        memberService.update(member, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @DeleteMapping("/v1/members/delete")
    public ApiResponse<Void> deleteUserInfo(
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = MemberSuccessCode.OK;
        memberService.delete(member);
        return ApiResponse.onSuccess(code, null);
    }

    @PostMapping("/login")
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

    @PostMapping("/reissue")
    public ApiResponse<TokenDTO.TokenPair> reissue(
            @Valid @RequestBody TokenDTO.Reissue dto
    ) {
        BaseSuccessCode code = MemberSuccessCode.OK;
        return ApiResponse.onSuccess(code, tokenService.rotate(dto.refreshToken()));
    }
}

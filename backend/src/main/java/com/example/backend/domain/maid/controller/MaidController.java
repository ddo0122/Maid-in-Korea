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
import com.example.backend.global.security.entity.AuthMember;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/v1/profiles")
    public ApiResponse<Void> createProfile(
            @AuthenticationPrincipal AuthMember member,
            @Valid @RequestBody MaidReqDTO.ProfileInfo dto
    ) {
        BaseSuccessCode code = MaidSuccessCode.CREATED;
        maidService.createProfile(member, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @GetMapping("/v1/profiles")
    public ApiResponse<List<MaidResDTO.Profiles>> getProfiles(
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = MaidSuccessCode.OK;
        return ApiResponse.onSuccess(code, maidService.getProfiles(member));
    }

    @PatchMapping("/v1/profiles")
    public ApiResponse<Void> updateProfile(
            @AuthenticationPrincipal AuthMember member,
            @RequestBody @Valid MaidReqDTO.UpdateInfo dto
    ) {
        BaseSuccessCode code = MaidSuccessCode.OK;
        maidService.updateProfile(member, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @DeleteMapping("/v1/profiles")
    public ApiResponse<Void> deleteProfile(
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = MaidSuccessCode.OK;
        maidService.deleteProfile(member);
        return ApiResponse.onSuccess(code, null);
    }

    @PatchMapping("/v1/profiles/deactivate")
    public ApiResponse<Void> deactivateProfile(
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = MaidSuccessCode.OK;
        maidService.deactivateProfile(member);
        return ApiResponse.onSuccess(code, null);
    }
    
}

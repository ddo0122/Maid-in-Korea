package com.example.backend.domain.feed.controller;

import com.example.backend.domain.feed.dto.FeedReqDTO;
import com.example.backend.domain.feed.dto.FeedResDTO;
import com.example.backend.domain.feed.service.FeedService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import com.example.backend.global.apiPayload.code.GeneralSuccessCode;
import com.example.backend.global.security.entity.AuthMember;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feeds")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @PostMapping("/v1/create")
    public ApiResponse<Void> create(
            @AuthenticationPrincipal AuthMember member,
            @RequestBody @Valid FeedReqDTO.Upload dto
    ) {
        BaseSuccessCode code = GeneralSuccessCode.OK;
        feedService.create(member, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @GetMapping("/v1/getFeed/{maidProfile_id}")
    public ApiResponse<List<FeedResDTO.FeedInfo>> getFeed(
            @PathVariable("maidProfile_id") Long maidProfileId
    ) {
        BaseSuccessCode code = GeneralSuccessCode.OK;
        return ApiResponse.onSuccess(code, feedService.getFeed(maidProfileId));
    }

    @PatchMapping("/v1")
    public ApiResponse<Void> updateFeed(
            @RequestParam Long id,
            @RequestBody @Valid FeedReqDTO.UpdateInfo dto,
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = GeneralSuccessCode.OK;
        feedService.updateFeed(id, dto, member);
        return ApiResponse.onSuccess(code, null);
    }

    @DeleteMapping("/v1")
    public ApiResponse<Void> deleteFeed(
            @RequestParam Long id,
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = GeneralSuccessCode.OK;
        feedService.deleteFeed(id, member);
        return ApiResponse.onSuccess(code, null);
    }
}

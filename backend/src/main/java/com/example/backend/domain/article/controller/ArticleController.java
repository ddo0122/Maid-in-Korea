package com.example.backend.domain.article.controller;

import com.example.backend.domain.article.dto.ArticleReqDTO;
import com.example.backend.domain.article.dto.ArticleResDTO;
import com.example.backend.domain.article.exception.code.ArticleSuccessCode;
import com.example.backend.domain.article.service.ArticleService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import com.example.backend.global.common.dto.CursorPaginationResDTO;
import com.example.backend.global.security.entity.AuthMember;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping("/v1")
    public ApiResponse<ArticleResDTO.Created> createArticle(
            @AuthenticationPrincipal AuthMember member,
            @RequestBody @Valid ArticleReqDTO.CreateInfo dto
    ) {
        BaseSuccessCode code = ArticleSuccessCode.CREATED;
        return ApiResponse.onSuccess(code, articleService.createArticle(member, dto));
    }

    @GetMapping("/v1")
    public ApiResponse<CursorPaginationResDTO<ArticleResDTO.Detail>> getArticles(
            @RequestParam(required = false) String cursor,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        BaseSuccessCode code = ArticleSuccessCode.OK;
        return ApiResponse.onSuccess(code, articleService.getArticles(cursor, size));
    }


    @PatchMapping("/v1")
    public ApiResponse<Void> updateArticle(
            @RequestParam Long id,
            @RequestBody @Valid ArticleReqDTO.UpdateInfo dto,
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = ArticleSuccessCode.UPDATED;
        articleService.updateArticle(id, dto, member);
        return ApiResponse.onSuccess(code, null);
    }

    @DeleteMapping("/v1")
    public ApiResponse<Void> deleteArticle(
            @RequestParam Long id,
            @AuthenticationPrincipal AuthMember member
    ) {
        BaseSuccessCode code = ArticleSuccessCode.OK;
        articleService.deleteArticle(id, member);
        return ApiResponse.onSuccess(code, null);
    }
}

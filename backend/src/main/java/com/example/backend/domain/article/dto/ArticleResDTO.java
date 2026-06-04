package com.example.backend.domain.article.dto;

import lombok.Builder;

import java.time.LocalDateTime;

public class ArticleResDTO {

    @Builder
    public record Created(
            Long articleId
    ) {
    }

    @Builder
    public record Detail(
            Long articleId,
            String name,
            LocalDateTime createAt,
            String title,
            String contents,
            Integer likeCount,
            Integer comments
    ) {
    }
}

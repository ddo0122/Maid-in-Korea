package com.example.backend.domain.feed.dto;

import java.time.LocalDateTime;

public class FeedResDTO {

    public record FeedInfo(
            Long feedId,
            String description,
            Integer likeCount,
            LocalDateTime createdAt
    ) {
    }
}

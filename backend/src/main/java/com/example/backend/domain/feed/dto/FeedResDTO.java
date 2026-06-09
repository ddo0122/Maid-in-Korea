package com.example.backend.domain.feed.dto;

public class FeedResDTO {

    public record FeedInfo(
            String description,
            Integer likeCount
    ) {
    }
}

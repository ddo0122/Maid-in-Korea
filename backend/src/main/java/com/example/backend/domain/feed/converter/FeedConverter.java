package com.example.backend.domain.feed.converter;

import com.example.backend.domain.feed.dto.FeedReqDTO;
import com.example.backend.domain.feed.dto.FeedResDTO;
import com.example.backend.domain.feed.entity.Feed;
import com.example.backend.domain.maid.entity.MaidProfile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FeedConverter {

    public static Feed toFeed(
            MaidProfile maidProfile,
            FeedReqDTO.Upload dto
    ) {
        return Feed.builder()
                .maidProfile(maidProfile)
                .description(dto.description())
                .likeCount(0)
                .build();
    }

    public static FeedResDTO.FeedInfo toFeedInfo(
            Feed feed
    ) {
        return new FeedResDTO.FeedInfo(
                feed.getDescription(),
                feed.getLikeCount()
        );
    }

    public static List<FeedResDTO.FeedInfo> toFeedInfos(
            List<Feed> feeds
    ) {
        return feeds.stream()
                .map(FeedConverter::toFeedInfo)
                .toList();
    }

}

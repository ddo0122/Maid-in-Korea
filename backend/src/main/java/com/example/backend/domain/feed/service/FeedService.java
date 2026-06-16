package com.example.backend.domain.feed.service;

import com.example.backend.domain.feed.converter.FeedConverter;
import com.example.backend.domain.feed.dto.FeedReqDTO;
import com.example.backend.domain.feed.dto.FeedResDTO;
import com.example.backend.domain.feed.entity.Feed;
import com.example.backend.domain.feed.exception.FeedException;
import com.example.backend.domain.feed.exception.code.FeedErrorCode;
import com.example.backend.domain.feed.repository.FeedRepository;
import com.example.backend.domain.maid.entity.Maid;
import com.example.backend.domain.maid.entity.MaidProfile;
import com.example.backend.domain.maid.repository.MaidProfileRepository;
import com.example.backend.domain.maid.repository.MaidRepository;
import com.example.backend.domain.member.entity.Member;
import com.example.backend.global.security.entity.AuthMember;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final FeedRepository feedRepository;
    private final MaidRepository maidRepository;
    private final MaidProfileRepository maidProfileRepository;

    @Transactional
    public void create(
            AuthMember authMember,
            FeedReqDTO.Upload dto
    ) {
        if (authMember == null) {
            throw new FeedException(FeedErrorCode.UNAUTHORIZED_MEMBER);
        }

        Member member = authMember.getMember();
        if (member == null) {
            throw new FeedException(FeedErrorCode.INVALID_MEMBER_INFO);
        }

        Maid maid = maidRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new FeedException(FeedErrorCode.FORBIDDEN_MAID_ONLY));

        MaidProfile maidProfile = dto.maidProfileId() == null
                ? maidProfileRepository.findFirstByMaidId(maid.getId())
                        .orElseThrow(() -> new FeedException(FeedErrorCode.PROFILE_NOT_FOUND))
                : maidProfileRepository.findByIdAndMaidId(dto.maidProfileId(), maid.getId())
                        .orElseThrow(() -> new FeedException(FeedErrorCode.PROFILE_NOT_FOUND));

        feedRepository.save(
                FeedConverter.toFeed(maidProfile, dto)
        );
    }

    @Transactional(readOnly = true)
    public List<FeedResDTO.FeedInfo> getFeed(
            Long maidProfileId
    ) {
        maidProfileRepository.findById(maidProfileId)
                .orElseThrow(() -> new FeedException(FeedErrorCode.PROFILE_NOT_FOUND));

        List<Feed> feeds = feedRepository.findAllByMaidProfileIdOrderByCreateAtDesc(maidProfileId);
        return FeedConverter.toFeedInfos(feeds);
    }

    @Transactional
    public void updateFeed(
            Long feedId,
            FeedReqDTO.UpdateInfo dto,
            AuthMember authMember
    ) {
        Feed feed = feedRepository.findById(feedId)
                .orElseThrow(() -> new FeedException(FeedErrorCode.FEED_NOT_FOUND));

        validateFeedOwner(feed, authMember);
        feed.patch(dto.description());
    }

    @Transactional
    public void deleteFeed(
            Long feedId,
            AuthMember authMember
    ) {
        Feed feed = feedRepository.findById(feedId)
                .orElseThrow(() -> new FeedException(FeedErrorCode.FEED_NOT_FOUND));

        validateFeedOwner(feed, authMember);
        feedRepository.delete(feed);
    }

    private void validateFeedOwner(
            Feed feed,
            AuthMember authMember
    ) {
        if (authMember == null) {
            throw new FeedException(FeedErrorCode.UNAUTHORIZED_MEMBER);
        }

        Member requestMember = authMember.getMember();
        if (requestMember == null) {
            throw new FeedException(FeedErrorCode.INVALID_MEMBER_INFO);
        }

        Long feedOwnerId = feed.getMaidProfile().getMaid().getMember().getId();
        Long requestMemberId = requestMember.getId();

        if (!Objects.equals(feedOwnerId, requestMemberId)) {
            throw new FeedException(FeedErrorCode.FORBIDDEN_FEED_OWNER_ONLY);
        }
    }
}

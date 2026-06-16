package com.example.backend.domain.maid.service;

import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.converter.CafeConverter;
import com.example.backend.domain.cafe.entity.CafeMaidInvitation;
import com.example.backend.domain.cafe.enums.CafeMaidInvitationStatus;
import com.example.backend.domain.cafe.exception.CafeException;
import com.example.backend.domain.cafe.exception.code.CafeErrorCode;
import com.example.backend.domain.cafe.repository.CafeMaidInvitationRepository;
import com.example.backend.domain.cafe.repository.CafeMaidRepository;
import com.example.backend.domain.maid.converter.MaidConverter;
import com.example.backend.domain.maid.dto.MaidReqDTO;
import com.example.backend.domain.maid.dto.MaidResDTO;
import com.example.backend.domain.maid.entity.Maid;
import com.example.backend.domain.maid.entity.MaidProfile;
import com.example.backend.domain.maid.exception.MaidException;
import com.example.backend.domain.maid.exception.code.MaidErrorCode;
import com.example.backend.domain.maid.repository.MaidProfileRepository;
import com.example.backend.domain.maid.repository.MaidRepository;
import com.example.backend.global.common.dto.CursorPaginationResDTO;
import com.example.backend.global.security.entity.AuthMember;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaidService {

    private static final int MAID_INVITATION_PAGE_SIZE = 20;

    private final MaidRepository maidRepository;
    private final MaidProfileRepository maidProfileRepository;
    private final CafeMaidRepository cafeMaidRepository;
    private final CafeMaidInvitationRepository cafeMaidInvitationRepository;

    @Transactional
    public void createProfile(
            AuthMember authMember,
            MaidReqDTO.ProfileInfo dto
    ) {
        Maid maid = maidRepository.findByMemberId(authMember.getMember().getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY));

        maidProfileRepository.save(MaidConverter.toMaidProfile(maid, dto));
    }

    @Transactional(readOnly = true)
    public List<MaidResDTO.Profiles> getProfiles(
            AuthMember authMember
    ) {
        Maid maid = maidRepository.findByMemberId(authMember.getMember().getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY));

        List<MaidProfile> profiles = maidProfileRepository.findAllByMaidId(maid.getId());
        return MaidConverter.toProfiles(profiles);
    }

    @Transactional
    public void updateProfile(
            AuthMember authMember,
            Long profileId,
            MaidReqDTO.UpdateInfo dto
    ) {
        MaidProfile profile = findOwnedProfile(authMember, profileId);

        MaidConverter.patchProfile(profile, dto);
    }

    @Transactional
    public void deleteProfile(
            AuthMember authMember,
            Long profileId
    ) {
        MaidProfile profile = findOwnedProfile(authMember, profileId);

        maidProfileRepository.delete(profile);
    }

    @Transactional
    public void deactivateProfile(
            AuthMember authMember,
            Long profileId
    ) {
        MaidProfile profile = findOwnedProfile(authMember, profileId);

        maidProfileRepository.save(MaidConverter.deactivateProfile(profile));
    }

    @Transactional
    public void handleInvitation(
            AuthMember authMember,
            Long invitationId,
            Boolean status
    ) {
        Maid maid = findMaid(authMember);
        CafeMaidInvitation invitation = cafeMaidInvitationRepository.findByIdFetchCafeAndMaidProfile(invitationId)
                .orElseThrow(() -> new CafeException(CafeErrorCode.MAID_INVITATION_NOT_FOUND));

        validateInvitationOwner(maid, invitation);
        validatePendingInvitation(invitation);

        if (Boolean.TRUE.equals(status)) {
            acceptInvitation(invitation);
            return;
        }

        cafeMaidInvitationRepository.updateStatus(
                invitation.getId(),
                CafeMaidInvitationStatus.REJECTED
        );
    }

    @Transactional(readOnly = true)
    public CursorPaginationResDTO<CafeResDTO.MaidInvitationInfo> getInvitations(
            AuthMember authMember,
            String cursor
    ) {
        Maid maid = findMaid(authMember);
        Long cursorId = parseCursor(cursor);

        List<CafeMaidInvitation> invitations = cafeMaidInvitationRepository.findAllByMaidAndCursor(
                maid,
                cursorId,
                PageRequest.of(0, MAID_INVITATION_PAGE_SIZE + 1)
        );

        boolean hasNext = invitations.size() > MAID_INVITATION_PAGE_SIZE;
        List<CafeMaidInvitation> pageInvitations = hasNext
                ? invitations.subList(0, MAID_INVITATION_PAGE_SIZE)
                : invitations;
        String nextCursor = hasNext
                ? String.valueOf(pageInvitations.get(pageInvitations.size() - 1).getId())
                : null;

        return CafeConverter.toMaidInvitationPage(
                pageInvitations,
                hasNext,
                nextCursor,
                MAID_INVITATION_PAGE_SIZE
        );
    }

    private MaidProfile findOwnedProfile(
            AuthMember authMember,
            Long profileId
    ) {
        Maid maid = findMaid(authMember);

        return maidProfileRepository.findByIdAndMaidId(profileId, maid.getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.PROFILE_NOT_FOUND));
    }

    private void acceptInvitation(
            CafeMaidInvitation invitation
    ) {
        if (cafeMaidRepository.existsByMaidProfileId(invitation.getMaidProfile().getId())) {
            throw new CafeException(CafeErrorCode.CAFE_MAID_ALREADY_EXISTS);
        }

        cafeMaidRepository.save(
                CafeConverter.toCafeMaid(invitation.getCafe(), invitation.getMaidProfile())
        );
        cafeMaidInvitationRepository.updateStatus(
                invitation.getId(),
                CafeMaidInvitationStatus.ACCEPTED
        );
    }

    private void validateInvitationOwner(
            Maid maid,
            CafeMaidInvitation invitation
    ) {
        if (!invitation.getMaidProfile().getMaid().getId().equals(maid.getId())) {
            throw new CafeException(CafeErrorCode.FORBIDDEN_MAID_INVITATION);
        }
    }

    private void validatePendingInvitation(
            CafeMaidInvitation invitation
    ) {
        if (invitation.getStatus() != CafeMaidInvitationStatus.PENDING) {
            throw new CafeException(CafeErrorCode.INVALID_MAID_INVITATION_STATUS);
        }
    }

    private Maid findMaid(
            AuthMember authMember
    ) {
        if (authMember == null || authMember.getMember() == null) {
            throw new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY);
        }

        return maidRepository.findByMemberId(authMember.getMember().getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY));
    }

    private Long parseCursor(
            String cursor
    ) {
        if (cursor == null || cursor.isBlank()) {
            return null;
        }

        try {
            return Long.parseLong(cursor);
        } catch (NumberFormatException e) {
            throw new CafeException(CafeErrorCode.INVALID_CURSOR);
        }
    }
}

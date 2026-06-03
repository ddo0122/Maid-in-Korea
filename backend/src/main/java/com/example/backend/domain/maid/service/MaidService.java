package com.example.backend.domain.maid.service;

import com.example.backend.domain.maid.converter.MaidConverter;
import com.example.backend.domain.maid.dto.MaidReqDTO;
import com.example.backend.domain.maid.dto.MaidResDTO;
import com.example.backend.domain.maid.entity.Maid;
import com.example.backend.domain.maid.entity.MaidProfile;
import com.example.backend.domain.maid.exception.MaidException;
import com.example.backend.domain.maid.exception.code.MaidErrorCode;
import com.example.backend.domain.maid.repository.MaidProfileRepository;
import com.example.backend.domain.maid.repository.MaidRepository;
import com.example.backend.global.security.entity.AuthMember;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaidService {

    private final MaidRepository maidRepository;
    private final MaidProfileRepository maidProfileRepository;

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
            MaidReqDTO.UpdateInfo dto
    ) {
        Maid maid = maidRepository.findByMemberId(authMember.getMember().getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY));

        MaidProfile profile = maidProfileRepository.findFirstByMaidId(maid.getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.PROFILE_NOT_FOUND));

        maidProfileRepository.save(MaidConverter.updateProfile(profile, dto));
    }

    @Transactional
    public void deleteProfile(
            AuthMember authMember
    ) {
        Maid maid = maidRepository.findByMemberId(authMember.getMember().getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY));

        MaidProfile profile = maidProfileRepository.findFirstByMaidId(maid.getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.PROFILE_NOT_FOUND));

        maidProfileRepository.delete(profile);
    }

    @Transactional
    public void deactivateProfile(
            AuthMember authMember
    ) {
        Maid maid = maidRepository.findByMemberId(authMember.getMember().getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY));

        MaidProfile profile = maidProfileRepository.findFirstByMaidId(maid.getId())
                .orElseThrow(() -> new MaidException(MaidErrorCode.PROFILE_NOT_FOUND));

        maidProfileRepository.save(MaidConverter.deactivateProfile(profile));
    }

}

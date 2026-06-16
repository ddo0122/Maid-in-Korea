package com.example.backend.domain.maid.converter;

import com.example.backend.domain.maid.dto.MaidReqDTO;
import com.example.backend.domain.maid.dto.MaidResDTO;
import com.example.backend.domain.maid.entity.Maid;
import com.example.backend.domain.maid.entity.MaidProfile;
import com.example.backend.domain.member.entity.Member;

import java.util.List;

public class MaidConverter {

    public static Maid toMaid(
            Member member
    ) {
        return Maid.builder()
                .member(member)
                .build();
    }

    public static MaidProfile toMaidProfile(
        Maid maid,
        MaidReqDTO.ProfileInfo dto
    ) {
        return MaidProfile.builder()
                .maid(maid)
                .name(dto.name())
                .description(dto.description())
                .serviceArea(dto.serviceArea())
                .instagram(dto.instagram())
                .x(dto.x())
                .isActive(true)
                .build();
    }

    public static List<MaidResDTO.Profiles> toProfiles(
            List<MaidProfile> profiles
    ) {
        return profiles.stream()
                .map(MaidConverter::toProfiles)
                .toList();
    }

    public static MaidResDTO.Profiles toProfiles(
            MaidProfile profile
    ) {
        return MaidResDTO.Profiles.builder()
                .profileId(profile.getId())
                .name(profile.getName())
                .description(profile.getDescription())
                .serviceArea(profile.getServiceArea())
                .instagram(profile.getInstagram())
                .x(profile.getX())
                .isActive(profile.getIsActive())
                .build();
    }

    public static MaidProfile patchProfile(
            MaidProfile profile,
            MaidReqDTO.UpdateInfo dto
    ) {
        profile.patch(
                dto.name(),
                dto.description(),
                dto.serviceArea(),
                dto.instagram(),
                dto.x()
        );
        return profile;
    }

    public static MaidProfile deactivateProfile(
            MaidProfile profile
    ) {
        profile.deactivate();
        return profile;
    }

    public static MaidResDTO.Signup toSignup(
            String accessToken
    ) {
        return MaidResDTO.Signup.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .build();
    }

    public static MaidResDTO.Login toLogin(
            String accessToken
    ) {
        return MaidResDTO.Login.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .build();
    }
}

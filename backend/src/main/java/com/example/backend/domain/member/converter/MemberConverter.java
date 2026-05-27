package com.example.backend.domain.member.converter;

import com.example.backend.domain.member.dto.MemberReqDTO;
import com.example.backend.domain.member.dto.MemberResDTO;
import com.example.backend.domain.member.entity.Member;
import com.example.backend.domain.member.enums.Gender;
import com.example.backend.domain.member.enums.Role;
import com.example.backend.global.security.dto.OAuthDTO;

public class MemberConverter {

    public static MemberResDTO.MemberInfo toMemberInfo(
            Member member
    ) {
        return MemberResDTO.MemberInfo.builder()
                .name(member.getName())
                .email(member.getEmail())
                .point(member.getPoint())
                .build();
    }

    public static Member toMember(
            MemberReqDTO.SignupInfo signupInfo,
            String encodedPassword
    ) {
        return Member.builder()
                .name(signupInfo.name())
                .email(signupInfo.email())
                .gender(signupInfo.gender())
                .birth(signupInfo.birth())
                .address(signupInfo.address())
                .detailAddress(signupInfo.detailAddress())
                .point(0)
                .password(encodedPassword)
                .role(Role.USER)
                .build();
    }

    public static Member toMember(
            OAuthDTO dto
    ) {
        return Member.builder()
                .name(dto.getName())
                .email(dto.getSocialEmail())
                .password("")
                .socialType(dto.getSocialType())
                .socialUid(dto.getSocialUid())
                .role(Role.USER)
                .gender(Gender.NONE)
                .birth("")
                .address("")
                .detailAddress("")
                .point(0)
                .build();
    }

    public static MemberResDTO.Signup toSignup(
            String accessToken
    ) {
        return MemberResDTO.Signup.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .build();
    }

    public static MemberResDTO.Login toLogin(
            String accessToken
    ) {
        return MemberResDTO.Login.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .build();
    }


}

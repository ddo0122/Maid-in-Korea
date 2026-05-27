package com.example.backend.domain.maid.converter;

import com.example.backend.domain.maid.dto.MaidResDTO;
import com.example.backend.domain.maid.entity.Maid;
import com.example.backend.domain.member.entity.Member;

public class MaidConverter {

    public static Maid toMaid(
            Member member
    ) {
        return Maid.builder()
                .member(member)
                .build();
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

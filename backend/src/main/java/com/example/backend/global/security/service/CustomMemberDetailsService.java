package com.example.backend.global.security.service;

import com.example.backend.domain.member.repository.MemberRepository;
import com.example.backend.domain.member.entity.Member;
import com.example.backend.domain.member.enums.SocialType;
import com.example.backend.domain.member.exception.MemberException;
import com.example.backend.domain.member.exception.code.MemberErrorCode;
import com.example.backend.global.security.entity.AuthMember;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomMemberDetailsService {

    private final MemberRepository memberRepository;

    public UserDetails loadUserById(
            Long id
    ) throws UsernameNotFoundException {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberException(MemberErrorCode.USER_NOT_FOUND));
        return new AuthMember(member);
    }
}

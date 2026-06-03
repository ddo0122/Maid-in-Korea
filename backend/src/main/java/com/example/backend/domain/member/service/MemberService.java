package com.example.backend.domain.member.service;

import com.example.backend.domain.maid.converter.MaidConverter;
import com.example.backend.domain.maid.exception.MaidException;
import com.example.backend.domain.maid.exception.code.MaidErrorCode;
import com.example.backend.domain.maid.repository.MaidRepository;
import com.example.backend.domain.member.converter.MemberConverter;
import com.example.backend.domain.member.dto.MemberReqDTO;
import com.example.backend.domain.member.dto.MemberResDTO;
import com.example.backend.domain.member.entity.Member;
import com.example.backend.domain.member.enums.Role;
import com.example.backend.domain.member.exception.MemberException;
import com.example.backend.domain.member.exception.code.MemberErrorCode;
import com.example.backend.domain.member.repository.MemberRepository;
import com.example.backend.global.security.entity.AuthMember;
import com.example.backend.global.security.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final MaidRepository maidRepository;

    public MemberResDTO.MemberInfo getMemberInfo(
            AuthMember member
    ) {
        return MemberConverter.toMemberInfo(member.getMember());
    }

    public MemberResDTO.Login login(
            MemberReqDTO.Login dto
    ) {
        Member member = memberRepository.findByEmailAndDeletedAtIsNull(dto.email())
                .orElseThrow(() -> new MemberException(MemberErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(dto.password(), member.getPassword())) {
            throw new MemberException(MemberErrorCode.INVALID_PASSWORD);
        }

        return MemberConverter.toLogin(tokenService.issue(member));
    }

    @Transactional
    public MemberResDTO.Signup signup(
            MemberReqDTO.SignupInfo dto
    ) {
        // Email 중복 확인 로직
        if(memberRepository.existsByEmailAndDeletedAtIsNull(dto.email())) {
            throw new MemberException(MemberErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Password Salting
        String encodedPassword = passwordEncoder.encode(dto.password());

        // UserReqDTO -> User Entity로 Converting
        Member member = MemberConverter.toMember(dto, encodedPassword);

        // DB에 User 정보 저장
        memberRepository.save(member);

        // 확인용 UserResDTO return
        return MemberConverter.toSignup(tokenService.issue(member));
    }

    // 메이드 로그인
    public MemberResDTO.Login maidLogin(
            MemberReqDTO.Login dto
    ) {
        Member member = memberRepository.findByEmailAndDeletedAtIsNull(dto.email())
                .orElseThrow(() -> new MemberException(MemberErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(dto.password(), member.getPassword())) {
            throw new MemberException(MemberErrorCode.INVALID_PASSWORD);
        }

        if (member.getRole() != Role.MAID) {
            throw new MaidException(MaidErrorCode.FORBIDDEN_MAID_ONLY);
        }

        return MemberConverter.toLogin(tokenService.issue(member));
    }


    // 메이드 회원가입
    @Transactional
    public MemberResDTO.Signup maidSignup(
            MemberReqDTO.SignupInfo dto
    ) {
        // Email 중복 확인 로직
        if(memberRepository.existsByEmailAndDeletedAtIsNull(dto.email())) {
            throw new MemberException(MemberErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Password Salting
        String encodedPassword = passwordEncoder.encode(dto.password());

        // UserReqDTO -> User Entity로 Converting
        Member member = MemberConverter.toMaidMember(dto, encodedPassword);

        // DB에 User 정보 저장
        memberRepository.save(member);

        maidRepository.save(MaidConverter.toMaid(member));

        // 확인용 UserResDTO return
        return MemberConverter.toSignup(tokenService.issue(member));
    }

    @Transactional
    public void update(
            AuthMember authMember,
            MemberReqDTO.UpdateInfo dto
    ) {
        Long memberId = authMember.getMember().getId();

        Member member = memberRepository.findByIdAndDeletedAtIsNull(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.USER_NOT_FOUND));

        if (
                dto.email() != null
                && !dto.email().isBlank()
                && !member.getEmail().equals(dto.email())
                && memberRepository.existsByEmailAndDeletedAtIsNull(dto.email())
        ) {
            throw new MemberException(MemberErrorCode.EMAIL_ALREADY_EXISTS);
        }
        memberRepository.updateMemberInfo(
                memberId,
                dto.name(),
                dto.email(),
                dto.birth(),
                dto.address(),
                dto.detailAddress()
        );
    }

    @Transactional
    public void delete(
            AuthMember authMember
    ) {
        Long memberId = authMember.getMember().getId();

        if(!memberRepository.existsById(memberId)) {
            throw new MemberException(MemberErrorCode.USER_NOT_FOUND);
        }

        memberRepository.deleteMember(memberId);
    }

}

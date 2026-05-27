package com.example.backend.domain.maid.service;

import com.example.backend.domain.maid.converter.MaidConverter;
import com.example.backend.domain.maid.dto.MaidReqDTO;
import com.example.backend.domain.maid.dto.MaidResDTO;
import com.example.backend.domain.maid.entity.Maid;
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
import com.example.backend.domain.member.service.MemberService;
import com.example.backend.global.security.entity.AuthMember;
import com.example.backend.global.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MaidService {

    private final MemberRepository memberRepository;
    private final MaidRepository maidRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


}

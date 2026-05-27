package com.example.backend.domain.member.repository;

import com.example.backend.domain.member.entity.Member;
import com.example.backend.domain.member.enums.SocialType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findById(Long id);

    Optional<Member> findByEmail(String username);

    Boolean existsByEmail(String email);

    Optional<Member> findBySocialTypeAndSocialUid(SocialType socialType, String socialUid);
}

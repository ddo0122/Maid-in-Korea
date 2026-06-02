package com.example.backend.domain.member.repository;

import com.example.backend.domain.member.entity.Member;
import com.example.backend.domain.member.enums.SocialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByIdAndDeletedAtIsNull(Long id);

    Optional<Member> findByEmailAndDeletedAtIsNull(String username);

    Boolean existsByEmailAndDeletedAtIsNull(String email);

    Optional<Member> findBySocialTypeAndSocialUidAndDeletedAtIsNull(SocialType socialType, String socialUid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
          UPDATE Member m
          SET m.name = COALESCE(NULLIF(:name, ''), m.name),
              m.email = COALESCE(NULLIF(:email, ''), m.email),
              m.birth = COALESCE(NULLIF(:birth, ''), m.birth),
              m.address = COALESCE(NULLIF(:address, ''), m.address),
              m.detailAddress = COALESCE(NULLIF(:detailAddress, ''), m.detailAddress),
              m.updatedAt = CURRENT_TIMESTAMP
          WHERE m.id = :memberId
            AND m.deletedAt IS NULL
          """)
    void updateMemberInfo(
            @Param("memberId") Long memberId,
            @Param("name") String name,
            @Param("email") String email,
            @Param("birth") String birth,
            @Param("address") String address,
            @Param("detailAddress") String detailAddress
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
          UPDATE Member m
          SET m.deletedAt = CURRENT_TIMESTAMP,
              m.updatedAt = CURRENT_TIMESTAMP
          WHERE m.id = :memberId
          """)
    void deleteMember(
            @Param("memberId") Long memberId
    );
}

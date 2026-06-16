package com.example.backend.domain.cafe.repository;

import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMaidInvitation;
import com.example.backend.domain.cafe.enums.CafeMaidInvitationStatus;
import com.example.backend.domain.maid.entity.Maid;
import com.example.backend.domain.maid.entity.MaidProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CafeMaidInvitationRepository extends JpaRepository<CafeMaidInvitation, Long> {

    boolean existsByCafeAndMaidProfileAndStatus(
            Cafe cafe,
            MaidProfile maidProfile,
            CafeMaidInvitationStatus status
    );

    @Query("""
            SELECT invitation
            FROM CafeMaidInvitation invitation
            JOIN FETCH invitation.cafe
            JOIN FETCH invitation.maidProfile maidProfile
            JOIN FETCH maidProfile.maid
            WHERE invitation.id = :id
            """)
    Optional<CafeMaidInvitation> findByIdFetchCafeAndMaidProfile(Long id);

    @Query("""
            SELECT invitation
            FROM CafeMaidInvitation invitation
            JOIN FETCH invitation.cafe
            JOIN FETCH invitation.maidProfile
            WHERE invitation.cafe = :cafe
            AND (:cursor IS NULL OR invitation.id < :cursor)
            ORDER BY invitation.id DESC
            """)
    List<CafeMaidInvitation> findAllByCafeAndCursor(
            @Param("cafe") Cafe cafe,
            @Param("cursor") Long cursor,
            Pageable pageable
    );

    @Query("""
            SELECT invitation
            FROM CafeMaidInvitation invitation
            JOIN FETCH invitation.cafe
            JOIN FETCH invitation.maidProfile maidProfile
            WHERE maidProfile.maid = :maid
            AND (:cursor IS NULL OR invitation.id < :cursor)
            ORDER BY invitation.id DESC
    """)
    List<CafeMaidInvitation> findAllByMaidAndCursor(
            @Param("maid") Maid maid,
            @Param("cursor") Long cursor,
            Pageable pageable
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE CafeMaidInvitation invitation
            SET invitation.status = :status
            WHERE invitation.id = :id
            """)
    void updateStatus(
            @Param("id") Long id,
            @Param("status") CafeMaidInvitationStatus status
    );
}

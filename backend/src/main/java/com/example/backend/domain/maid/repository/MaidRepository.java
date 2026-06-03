package com.example.backend.domain.maid.repository;

import com.example.backend.domain.maid.entity.Maid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaidRepository extends JpaRepository<Maid, Long> {
    Optional<Maid> findByMemberId(Long memberId);
}

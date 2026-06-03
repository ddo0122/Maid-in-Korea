package com.example.backend.domain.maid.repository;

import com.example.backend.domain.maid.entity.MaidProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaidProfileRepository extends JpaRepository<MaidProfile, Long> {

    List<MaidProfile> findAllByMaidId(Long maidId);

    Optional<MaidProfile> findFirstByMaidId(Long maidId);
}

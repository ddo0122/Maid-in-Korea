package com.example.backend.domain.member.repository;

import com.example.backend.domain.maid.entity.MaidProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaidProfileRepository extends JpaRepository<MaidProfile, Long> {

}

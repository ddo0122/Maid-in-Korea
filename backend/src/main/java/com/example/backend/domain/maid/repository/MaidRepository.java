package com.example.backend.domain.maid.repository;

import com.example.backend.domain.maid.entity.Maid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaidRepository extends JpaRepository<Maid, Long> {

}

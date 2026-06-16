package com.example.backend.domain.cafe.repository;

import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMaid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CafeMaidRepository extends JpaRepository<CafeMaid, Long> {

    boolean existsByMaidProfileId(Long maidProfileId);

    @Query("""
            SELECT cafeMaid
            FROM CafeMaid cafeMaid
            JOIN FETCH cafeMaid.maidProfile
            WHERE cafeMaid.cafe = :cafe
            """)
    List<CafeMaid> findAllByCafeFetchMaidProfile(Cafe cafe);
}

package com.example.backend.domain.admin.repository;

import com.example.backend.domain.admin.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByIdAndDeletedAtIsNull(Long id);

    @Query("""
            SELECT admin
            FROM Admin admin
            LEFT JOIN FETCH admin.cafe
            WHERE admin.id = :id
            AND admin.deletedAt IS NULL
            """)
    Optional<Admin> findByIdAndDeletedAtIsNullFetchCafe(Long id);

    @Query("""
            SELECT DISTINCT admin
            FROM Admin admin
            LEFT JOIN FETCH admin.cafe cafe
            LEFT JOIN FETCH cafe.menus
            WHERE admin.id = :id
            AND admin.deletedAt IS NULL
            """)
    Optional<Admin> findByIdAndDeletedAtIsNullFetchCafeAndMenus(Long id);

    Optional<Admin> findByLoginIdAndDeletedAtIsNull(String loginId);

}

package com.example.backend.domain.admin.repository;

import com.example.backend.domain.admin.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByIdAndDeletedAtIsNull(Long id);

    Optional<Admin> findByLoginIdAndDeletedAtIsNull(String loginId);

}

package com.example.backend.global.security.service;

import com.example.backend.domain.admin.entity.Admin;
import com.example.backend.domain.admin.exception.AdminException;
import com.example.backend.domain.admin.exception.code.AdminErrorCode;
import com.example.backend.domain.admin.repository.AdminRepository;
import com.example.backend.global.security.entity.AuthAdmin;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomAdminDetailsService {

    private final AdminRepository adminRepository;

    public AuthAdmin loadUserById(Long adminId) {
        Admin admin = adminRepository.findByIdAndDeletedAtIsNull(adminId)
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_NOT_FOUND));

        return new AuthAdmin(admin);
    }
}

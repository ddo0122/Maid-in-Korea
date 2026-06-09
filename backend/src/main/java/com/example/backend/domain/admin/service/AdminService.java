package com.example.backend.domain.admin.service;

import com.example.backend.domain.admin.converter.AdminConverter;
import com.example.backend.domain.admin.dto.AdminReqDTO;
import com.example.backend.domain.admin.dto.AdminResDTO;
import com.example.backend.domain.admin.entity.Admin;
import com.example.backend.domain.admin.exception.AdminException;
import com.example.backend.domain.admin.exception.code.AdminErrorCode;
import com.example.backend.domain.admin.repository.AdminRepository;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.repository.CafeRepository;
import com.example.backend.global.security.entity.AuthAdmin;
import com.example.backend.global.security.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final AdminRepository adminRepository;
    private final CafeRepository cafeRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AdminResDTO.Login login(
            AdminReqDTO.Login dto
    ) {
        Admin admin = adminRepository.findByLoginIdAndDeletedAtIsNull(dto.loginId())
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_NOT_FOUND));

        if (!passwordEncoder.matches(dto.password(), admin.getPassword())) {
            throw new AdminException(AdminErrorCode.INVALID_PASSWORD);
        }

        return AdminConverter.toLogin(tokenService.issue(admin));
    }

    @Transactional
    public void updateCafe(
            AuthAdmin authAdmin,
            AdminReqDTO.UpdateCafe dto
    ) {
        validateAdmin(authAdmin);

        Admin admin = adminRepository.findByIdAndDeletedAtIsNull(authAdmin.getAdmin().getId())
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_NOT_FOUND));

        if (admin.getCafe() == null) {
            throw new AdminException(AdminErrorCode.ADMIN_CAFE_NOT_FOUND);
        }

        Cafe cafe = cafeRepository.findById(admin.getCafe().getId())
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_CAFE_NOT_FOUND));

        validateCafeInfo(cafe, dto);
        AdminConverter.patchCafe(cafe, dto);
    }

    private void validateAdmin(
            AuthAdmin authAdmin
    ) {
        if (authAdmin == null || authAdmin.getAdmin() == null) {
            throw new AdminException(AdminErrorCode.FORBIDDEN_ADMIN_ONLY);
        }
    }

    private void validateCafeInfo(
            Cafe cafe,
            AdminReqDTO.UpdateCafe dto
    ) {
        LocalTime defaultOpenTime = dto.defaultOpenTime() != null
                ? dto.defaultOpenTime()
                : cafe.getDefaultOpenTime();
        LocalTime defaultCloseTime = dto.defaultCloseTime() != null
                ? dto.defaultCloseTime()
                : cafe.getDefaultCloseTime();
        LocalTime defaultLastOrderTime = dto.defaultLastOrderTime() != null
                ? dto.defaultLastOrderTime()
                : cafe.getDefaultLastOrderTime();

        if (defaultOpenTime == null || defaultCloseTime == null || defaultLastOrderTime == null) {
            return;
        }

        if (
                defaultLastOrderTime.isBefore(defaultOpenTime)
                || defaultLastOrderTime.isAfter(defaultCloseTime)
                || defaultCloseTime.isBefore(defaultOpenTime)
        ) {
            throw new AdminException(AdminErrorCode.INVALID_CAFE_INFO);
        }
    }
}

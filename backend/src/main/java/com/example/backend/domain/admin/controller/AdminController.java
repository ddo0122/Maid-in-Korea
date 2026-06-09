package com.example.backend.domain.admin.controller;

import com.example.backend.domain.admin.dto.AdminReqDTO;
import com.example.backend.domain.admin.dto.AdminResDTO;
import com.example.backend.domain.admin.exception.code.AdminSuccessCode;
import com.example.backend.domain.admin.service.AdminService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import com.example.backend.global.security.entity.AuthAdmin;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/v1/login")
    public ApiResponse<AdminResDTO.Login> login(
            @Valid @RequestBody AdminReqDTO.Login dto
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        return ApiResponse.onSuccess(code, adminService.login(dto));
    }

    @PatchMapping("/cafes/v1/update")
    public ApiResponse<Void> updateCafe(
            @AuthenticationPrincipal AuthAdmin admin,
            @Valid @RequestBody AdminReqDTO.UpdateCafe dto
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        adminService.updateCafe(admin, dto);
        return ApiResponse.onSuccess(code, null);
    }
}

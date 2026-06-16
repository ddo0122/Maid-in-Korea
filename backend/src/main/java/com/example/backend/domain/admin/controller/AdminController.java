package com.example.backend.domain.admin.controller;

import com.example.backend.domain.admin.dto.AdminReqDTO;
import com.example.backend.domain.admin.dto.AdminResDTO;
import com.example.backend.domain.admin.exception.code.AdminSuccessCode;
import com.example.backend.domain.admin.service.AdminService;
import com.example.backend.domain.cafe.dto.CafeReqDTO;
import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.service.CafeService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import com.example.backend.global.common.dto.CursorPaginationResDTO;
import com.example.backend.global.security.entity.AuthAdmin;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CafeService cafeService;

    @PostMapping("/v1/login")
    public ApiResponse<AdminResDTO.Login> login(
            @Valid @RequestBody AdminReqDTO.Login dto
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        return ApiResponse.onSuccess(code, adminService.login(dto));
    }

    @GetMapping("/v1/me")
    public ApiResponse<AdminResDTO.Me> getMe(
            @AuthenticationPrincipal AuthAdmin admin
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        return ApiResponse.onSuccess(code, adminService.getMe(admin));
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

    @GetMapping("/cafes/v1/monthly-schedules")
    public ApiResponse<CafeResDTO.MonthlyScheduleInfo> getMonthlySchedule(
            @AuthenticationPrincipal AuthAdmin admin,
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        return ApiResponse.onSuccess(
                code,
                adminService.getAdminMonthlySchedule(admin, year, month)
        );
    }

    @PostMapping("/cafes/v1/monthly-schedules")
    public ApiResponse<Void> saveMonthlyScheduleDraft(
            @AuthenticationPrincipal AuthAdmin admin,
            @Valid @RequestBody CafeReqDTO.UpsertMonthlySchedule dto
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        adminService.saveMonthlyScheduleDraft(admin, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @PatchMapping("/cafes/v1/monthly-schedules/{scheduleId}")
    public ApiResponse<Void> patchMonthlyScheduleDraft(
            @AuthenticationPrincipal AuthAdmin admin,
            @PathVariable Long scheduleId,
            @Valid @RequestBody CafeReqDTO.PatchMonthlySchedule dto
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        adminService.patchMonthlyScheduleDraft(admin, scheduleId, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @PostMapping("/cafes/v1/monthly-schedules/{scheduleId}/publish")
    public ApiResponse<Void> publishMonthlySchedule(
            @AuthenticationPrincipal AuthAdmin admin,
            @PathVariable Long scheduleId
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        adminService.publishMonthlySchedule(admin, scheduleId);
        return ApiResponse.onSuccess(code, null);
    }

    @PostMapping("/cafes/v1/menus")
    public ApiResponse<Void> addMenus(
            @AuthenticationPrincipal AuthAdmin admin,
            @Valid @RequestBody CafeReqDTO.CreateMenu dto
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        adminService.addMenus(admin, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @PatchMapping("/cafes/v1/menus")
    public ApiResponse<Void> updateMenus(
            @AuthenticationPrincipal AuthAdmin admin,
            @RequestParam Long id,
            @Valid @RequestBody CafeReqDTO.UpdateMenu dto
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        adminService.updateMenus(admin, id, dto);
        return ApiResponse.onSuccess(code, null);
    }

    @DeleteMapping("/cafes/v1/menus")
    public ApiResponse<Void> deleteMenus(
            @AuthenticationPrincipal AuthAdmin admin,
            @RequestParam Long id
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        adminService.deleteMenus(admin, id);
        return ApiResponse.onSuccess(code, null);
    }

    @GetMapping("/maids/v1/invitations")
    public ApiResponse<CursorPaginationResDTO<CafeResDTO.MaidInvitationInfo>> getMaidInvitations(
            @AuthenticationPrincipal AuthAdmin admin,
            @RequestParam(required = false) String cursor
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        return ApiResponse.onSuccess(code, cafeService.getAdminMaidInvitations(admin, cursor));
    }

    @PostMapping("/maids/v1/invitation")
    public ApiResponse<Void> invitation(
            @AuthenticationPrincipal AuthAdmin admin,
            @RequestParam Long id
    ) {
        BaseSuccessCode code = AdminSuccessCode.OK;
        cafeService.inviteMaid(admin, id);
        return ApiResponse.onSuccess(code, null);
    }
}

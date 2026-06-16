package com.example.backend.domain.cafe.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class CafeResDTO {

    @Builder
    public record HomeInfo(
            Long id,
            Long cafeId,
            String name,
            List<String> tag,
            String todayOperatingHour,
            String coverImage,
            String location,
            String area,
            Double rating,
            String distance
    ) {}

    @Builder
    public record DetailInfo(
            String name,
            String coverImage,
            String location,
            Double rating,
            String description,
            String operatingHour,
            String phone,
            String website,
            String defaultOpenTime,
            String defaultCloseTime,
            String defaultLastOrderTime,
            String regularClosedDays,
            List<MenuInfo> menus,
            List<ScheduleInfo> currentMonthSchedules,
            List<MaidInfo> maids
    ) {}

    @Builder
    public record MenuInfo(
            Long menuId,
            String name,
            Integer price,
            String image
    ) {}

    @Builder
    public record ScheduleInfo(
            LocalDate date,
            List<ScheduleMaidInfo> maids
    ) {}

    @Builder
    public record ScheduleMaidInfo(
            Long maidProfileId,
            String name,
            String startTime,
            String endTime
    ) {}

    @Builder
    public record MaidInfo(
            Long maidProfileId,
            String name,
            String description,
            String serviceArea,
            String instagram,
            String x
    ) {}

    @Builder
    public record MonthlyScheduleInfo(
            Long scheduleId,
            Integer year,
            Integer month,
            String status,
            LocalDateTime publishedAt,
            List<OperatingHourInfo> operatingHours,
            List<ScheduleInfo> schedules
    ) {}

    @Builder
    public record OperatingHourInfo(
            LocalDate businessDate,
            Boolean isOpen,
            String openTime,
            String closeTime,
            String lastOrderTime,
            String note
    ) {}

    @Builder
    public record MaidInvitationInfo(
            Long invitationId,
            Long cafeId,
            String cafeName,
            Long maidProfileId,
            String maidProfileName,
            String maidProfileDescription,
            String maidProfileServiceArea,
            String maidProfileInstagram,
            String maidProfileX,
            String status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}
}

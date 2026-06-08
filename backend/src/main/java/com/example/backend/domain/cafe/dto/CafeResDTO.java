package com.example.backend.domain.cafe.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

public class CafeResDTO {

    @Builder
    public record HomeInfo(
            String name,
            List<String> tag,
            String todayOperatingHour,
            String coverImage,
            String location,
            Double rating
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
            List<MenuInfo> menus,
            List<ScheduleInfo> currentMonthSchedules,
            List<MaidInfo> maids
    ) {}

    @Builder
    public record MenuInfo(
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
}

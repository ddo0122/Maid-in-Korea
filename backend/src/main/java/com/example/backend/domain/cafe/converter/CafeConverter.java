package com.example.backend.domain.cafe.converter;

import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMaid;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.entity.CafeOperatingHour;
import com.example.backend.domain.cafe.entity.CafeSchedule;
import com.example.backend.domain.cafe.entity.CafeScheduleMaid;
import com.example.backend.domain.cafe.entity.CafeTag;
import com.example.backend.domain.cafe.entity.Menu;
import com.example.backend.domain.maid.entity.MaidProfile;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Component
public class CafeConverter {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final String CLOSED = "영업안함";
    private static final String OPERATING_HOUR_NOT_REGISTERED = "운영시간 미등록";

    public static CafeResDTO.HomeInfo toHomeInfo(
            Cafe cafe,
            Optional<CafeOperatingHour> todayOperatingHour
    ) {
        return CafeResDTO.HomeInfo.builder()
                .name(cafe.getName())
                .tag(toTags(cafe))
                .todayOperatingHour(formatOperatingHour(todayOperatingHour))
                .coverImage(cafe.getCoverImage())
                .location(cafe.getLocation())
                .rating(cafe.getRating())
                .build();
    }

    public static CafeResDTO.DetailInfo toDetailInfo(
            Cafe cafe,
            Optional<CafeOperatingHour> todayOperatingHour,
            Optional<CafeMonthlySchedule> currentMonthSchedule
    ) {
        return CafeResDTO.DetailInfo.builder()
                .name(cafe.getName())
                .coverImage(cafe.getCoverImage())
                .location(cafe.getLocation())
                .rating(cafe.getRating())
                .description(cafe.getDescription())
                .operatingHour(formatOperatingHour(todayOperatingHour))
                .phone(cafe.getPhone())
                .website(cafe.getWebsite())
                .menus(toMenus(cafe.getMenus()))
                .currentMonthSchedules(toSchedules(currentMonthSchedule))
                .maids(toMaids(cafe.getCafeMaids()))
                .build();
    }

    private static List<String> toTags(
            Cafe cafe
    ) {
        return cafe.getCafeTags().stream()
                .map(CafeTag::getTag)
                .map(tag -> tag.getName())
                .toList();
    }

    private static List<CafeResDTO.MenuInfo> toMenus(
            List<Menu> menus
    ) {
        return menus.stream()
                .map(menu -> CafeResDTO.MenuInfo.builder()
                        .name(menu.getName())
                        .price(menu.getPrice())
                        .image(menu.getImage())
                        .build())
                .toList();
    }

    private static List<CafeResDTO.ScheduleInfo> toSchedules(
            Optional<CafeMonthlySchedule> currentMonthSchedule
    ) {
        return currentMonthSchedule
                .map(monthlySchedule -> monthlySchedule.getSchedules().stream()
                        .map(CafeConverter::toSchedule)
                        .toList())
                .orElse(List.of());
    }

    private static CafeResDTO.ScheduleInfo toSchedule(
            CafeSchedule schedule
    ) {
        return CafeResDTO.ScheduleInfo.builder()
                .date(schedule.getWorkDate())
                .maids(schedule.getCafeScheduleMaids().stream()
                        .map(CafeConverter::toScheduleMaid)
                        .toList())
                .build();
    }

    private static CafeResDTO.ScheduleMaidInfo toScheduleMaid(
            CafeScheduleMaid scheduleMaid
    ) {
        MaidProfile maidProfile = scheduleMaid.getMaidProfile();

        return CafeResDTO.ScheduleMaidInfo.builder()
                .maidProfileId(maidProfile.getId())
                .name(maidProfile.getName())
                .startTime(formatTime(scheduleMaid.getStartTime()))
                .endTime(formatTime(scheduleMaid.getEndTime()))
                .build();
    }

    private static List<CafeResDTO.MaidInfo> toMaids(
            List<CafeMaid> cafeMaids
    ) {
        return cafeMaids.stream()
                .map(cafeMaid -> toMaid(cafeMaid.getMaidProfile()))
                .toList();
    }

    private static CafeResDTO.MaidInfo toMaid(
            MaidProfile maidProfile
    ) {
        return CafeResDTO.MaidInfo.builder()
                .maidProfileId(maidProfile.getId())
                .name(maidProfile.getName())
                .description(maidProfile.getDescription())
                .serviceArea(maidProfile.getServiceArea())
                .instagram(maidProfile.getInstagram())
                .x(maidProfile.getX())
                .build();
    }

    private static String formatOperatingHour(
            Optional<CafeOperatingHour> operatingHour
    ) {
        return operatingHour
                .map(CafeConverter::formatOperatingHour)
                .orElse(OPERATING_HOUR_NOT_REGISTERED);
    }

    private static String formatOperatingHour(
            CafeOperatingHour operatingHour
    ) {
        if (!Boolean.TRUE.equals(operatingHour.getIsOpen())) {
            return CLOSED;
        }

        LocalTime openTime = operatingHour.getOpenTime();
        LocalTime closeTime = operatingHour.getCloseTime();
        if (openTime == null || closeTime == null) {
            return OPERATING_HOUR_NOT_REGISTERED;
        }

        return openTime.format(TIME_FORMATTER) + " - " + closeTime.format(TIME_FORMATTER);
    }

    private static String formatTime(
            LocalTime time
    ) {
        if (time == null) {
            return null;
        }
        return time.format(TIME_FORMATTER);
    }
}

package com.example.backend.domain.cafe.converter;

import com.example.backend.domain.admin.entity.Admin;
import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMaid;
import com.example.backend.domain.cafe.entity.CafeMaidInvitation;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.entity.CafeOperatingHour;
import com.example.backend.domain.cafe.entity.CafeSchedule;
import com.example.backend.domain.cafe.entity.CafeScheduleMaid;
import com.example.backend.domain.cafe.entity.CafeTag;
import com.example.backend.domain.cafe.entity.Menu;
import com.example.backend.domain.cafe.enums.CafeMaidInvitationStatus;
import com.example.backend.domain.maid.entity.MaidProfile;
import com.example.backend.global.common.dto.CursorPaginationResDTO;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class CafeConverter {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final String OPERATING_HOUR_NOT_REGISTERED = "운영시간 미등록";

    public static CafeResDTO.HomeInfo toHomeInfo(
            Cafe cafe,
            Optional<CafeOperatingHour> todayOperatingHour
    ) {
        return CafeResDTO.HomeInfo.builder()
                .id(cafe.getId())
                .cafeId(cafe.getId())
                .name(cafe.getName())
                .tag(toTags(cafe))
                .todayOperatingHour(formatOperatingHour(cafe, todayOperatingHour))
                .coverImage(cafe.getCoverImage())
                .location(cafe.getLocation())
                .area(cafe.getArea())
                .rating(cafe.getRating())
                .distance(cafe.getDistance())
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
                .operatingHour(formatOperatingHour(cafe, todayOperatingHour))
                .phone(cafe.getPhone())
                .website(cafe.getWebsite())
                .defaultOpenTime(formatTime(cafe.getDefaultOpenTime()))
                .defaultCloseTime(formatTime(cafe.getDefaultCloseTime()))
                .defaultLastOrderTime(formatTime(cafe.getDefaultLastOrderTime()))
                .regularClosedDays(cafe.getRegularClosedDays())
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
                        .menuId(menu.getId())
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

    public static CafeResDTO.MonthlyScheduleInfo toMonthlySchedule(
            CafeMonthlySchedule monthlySchedule
    ) {
        return CafeResDTO.MonthlyScheduleInfo.builder()
                .scheduleId(monthlySchedule.getId())
                .year(monthlySchedule.getYear())
                .month(monthlySchedule.getMonth())
                .status(monthlySchedule.getStatus().name())
                .publishedAt(monthlySchedule.getPublishedAt())
                .operatingHours(toOperatingHours(monthlySchedule.getOperatingHours()))
                .schedules(monthlySchedule.getSchedules().stream()
                        .sorted(Comparator.comparing(CafeSchedule::getWorkDate))
                        .map(CafeConverter::toSchedule)
                        .toList())
                .build();
    }

    public static CafeMaidInvitation toCafeMaidInvitation(
            Cafe cafe,
            MaidProfile maidProfile,
            Admin admin
    ) {
        return CafeMaidInvitation.builder()
                .cafe(cafe)
                .maidProfile(maidProfile)
                .admin(admin)
                .status(CafeMaidInvitationStatus.PENDING)
                .build();
    }

    public static CafeMaid toCafeMaid(
            Cafe cafe,
            MaidProfile maidProfile
    ) {
        return CafeMaid.builder()
                .cafe(cafe)
                .maidProfile(maidProfile)
                .build();
    }

    public static CafeResDTO.MaidInvitationInfo toMaidInvitationInfo(
            CafeMaidInvitation invitation
    ) {
        Cafe cafe = invitation.getCafe();
        MaidProfile maidProfile = invitation.getMaidProfile();

        return CafeResDTO.MaidInvitationInfo.builder()
                .invitationId(invitation.getId())
                .cafeId(cafe.getId())
                .cafeName(cafe.getName())
                .maidProfileId(maidProfile.getId())
                .maidProfileName(maidProfile.getName())
                .maidProfileDescription(maidProfile.getDescription())
                .maidProfileServiceArea(maidProfile.getServiceArea())
                .maidProfileInstagram(maidProfile.getInstagram())
                .maidProfileX(maidProfile.getX())
                .status(invitation.getStatus().name())
                .createdAt(invitation.getCreateAt())
                .updatedAt(invitation.getUpdatedAt())
                .build();
    }

    public static CursorPaginationResDTO<CafeResDTO.MaidInvitationInfo> toMaidInvitationPage(
            List<CafeMaidInvitation> invitations,
            boolean hasNext,
            String nextCursor,
            int pageSize
    ) {
        return CursorPaginationResDTO.<CafeResDTO.MaidInvitationInfo>builder()
                .data(invitations.stream()
                        .map(CafeConverter::toMaidInvitationInfo)
                        .toList())
                .hasNext(hasNext)
                .nextCursor(nextCursor)
                .pageSize(pageSize)
                .build();
    }

    private static List<CafeResDTO.OperatingHourInfo> toOperatingHours(
            List<CafeOperatingHour> operatingHours
    ) {
        return operatingHours.stream()
                .sorted(Comparator.comparing(CafeOperatingHour::getBusinessDate))
                .map(operatingHour -> CafeResDTO.OperatingHourInfo.builder()
                        .businessDate(operatingHour.getBusinessDate())
                        .isOpen(operatingHour.getIsOpen())
                        .openTime(formatTime(operatingHour.getOpenTime()))
                        .closeTime(formatTime(operatingHour.getCloseTime()))
                        .lastOrderTime(formatTime(operatingHour.getLastOrderTime()))
                        .note(operatingHour.getNote())
                        .build())
                .toList();
    }

    private static String formatDefaultOperatingHour(
            Cafe cafe
    ) {
        LocalTime openTime = cafe.getDefaultOpenTime();
        LocalTime closeTime = cafe.getDefaultCloseTime();
        if (openTime == null || closeTime == null) {
            return OPERATING_HOUR_NOT_REGISTERED;
        }

        return openTime.format(TIME_FORMATTER) + " - " + closeTime.format(TIME_FORMATTER);
    }

    private static String formatOperatingHour(
            Cafe cafe,
            Optional<CafeOperatingHour> todayOperatingHour
    ) {
        String defaultOperatingHour = formatDefaultOperatingHour(cafe);
        if (!OPERATING_HOUR_NOT_REGISTERED.equals(defaultOperatingHour)) {
            return defaultOperatingHour;
        }

        return todayOperatingHour
                .map(CafeConverter::formatOperatingHour)
                .orElse(OPERATING_HOUR_NOT_REGISTERED);
    }

    private static String formatOperatingHour(
            CafeOperatingHour operatingHour
    ) {
        if (!Boolean.TRUE.equals(operatingHour.getIsOpen())) {
            return OPERATING_HOUR_NOT_REGISTERED;
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

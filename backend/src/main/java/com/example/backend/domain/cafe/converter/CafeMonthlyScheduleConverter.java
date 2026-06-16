package com.example.backend.domain.cafe.converter;

import com.example.backend.domain.cafe.dto.CafeReqDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.entity.CafeOperatingHour;
import com.example.backend.domain.cafe.entity.CafeSchedule;
import com.example.backend.domain.cafe.entity.CafeScheduleMaid;
import com.example.backend.domain.cafe.enums.CafeMonthlyScheduleStatus;
import com.example.backend.domain.maid.entity.MaidProfile;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

public class CafeMonthlyScheduleConverter {

    public static CafeMonthlySchedule toDraft(
            Cafe cafe,
            YearMonth targetMonth
    ) {
        return CafeMonthlySchedule.builder()
                .cafe(cafe)
                .year(targetMonth.getYear())
                .month(targetMonth.getMonthValue())
                .status(CafeMonthlyScheduleStatus.DRAFT)
                .build();
    }

    public static List<CafeOperatingHour> toOperatingHours(
            CafeMonthlySchedule monthlySchedule,
            List<CafeReqDTO.OperatingHour> operatingHours
    ) {
        return operatingHours.stream()
                .map(operatingHour -> CafeOperatingHour.builder()
                        .monthlySchedule(monthlySchedule)
                        .businessDate(operatingHour.businessDate())
                        .isOpen(operatingHour.isOpen())
                        .openTime(operatingHour.openTime())
                        .closeTime(operatingHour.closeTime())
                        .lastOrderTime(operatingHour.lastOrderTime())
                        .note(trimNullable(operatingHour.note()))
                        .build())
                .toList();
    }

    public static CafeSchedule toSchedule(
            CafeMonthlySchedule monthlySchedule,
            CafeReqDTO.DailySchedule dailySchedule
    ) {
        return CafeSchedule.builder()
                .monthlySchedule(monthlySchedule)
                .workDate(dailySchedule.workDate())
                .build();
    }

    public static List<CafeScheduleMaid> toScheduleMaids(
            CafeSchedule schedule,
            List<CafeReqDTO.ScheduleMaid> maids,
            Map<Long, MaidProfile> maidProfiles
    ) {
        return maids.stream()
                .map(maid -> CafeScheduleMaid.builder()
                        .cafeSchedule(schedule)
                        .maidProfile(maidProfiles.get(maid.maidProfileId()))
                        .startTime(maid.startTime())
                        .endTime(maid.endTime())
                        .note(trimNullable(maid.note()))
                        .build())
                .toList();
    }

    private static String trimNullable(
            String value
    ) {
        return value != null ? value.trim() : null;
    }
}

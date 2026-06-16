package com.example.backend.domain.cafe.validator;

import com.example.backend.domain.cafe.dto.CafeReqDTO;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.exception.CafeException;
import com.example.backend.domain.cafe.exception.code.CafeErrorCode;
import com.example.backend.domain.maid.entity.MaidProfile;
import org.springframework.stereotype.Component;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class CafeMonthlyScheduleValidator {

    public YearMonth validate(
            CafeReqDTO.UpsertMonthlySchedule dto
    ) {
        if (dto == null || dto.operatingHours() == null || dto.schedules() == null) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }

        YearMonth targetMonth = createYearMonth(dto.year(), dto.month());

        validateOperatingHours(dto.operatingHours(), targetMonth);
        validateDailySchedules(dto.schedules(), targetMonth);

        return targetMonth;
    }

    public void validateMaidProfiles(
            CafeReqDTO.UpsertMonthlySchedule dto,
            Map<Long, MaidProfile> maidProfiles
    ) {
        for (CafeReqDTO.DailySchedule dailySchedule : dto.schedules()) {
            for (CafeReqDTO.ScheduleMaid maid : dailySchedule.maids()) {
                if (!maidProfiles.containsKey(maid.maidProfileId())) {
                    throw new CafeException(CafeErrorCode.MAID_PROFILE_NOT_IN_CAFE);
                }
            }
        }
    }

    public void validatePublishable(
            CafeMonthlySchedule monthlySchedule
    ) {
        if (monthlySchedule.getOperatingHours().isEmpty()) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }
    }

    private YearMonth createYearMonth(
            Integer year,
            Integer month
    ) {
        try {
            return YearMonth.of(year, month);
        } catch (DateTimeException | NullPointerException exception) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }
    }

    private void validateOperatingHours(
            List<CafeReqDTO.OperatingHour> operatingHours,
            YearMonth targetMonth
    ) {
        Set<LocalDate> businessDates = new HashSet<>();

        for (CafeReqDTO.OperatingHour operatingHour : operatingHours) {
            LocalDate businessDate = operatingHour.businessDate();

            if (businessDate == null || !YearMonth.from(businessDate).equals(targetMonth)) {
                throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
            }

            if (!businessDates.add(businessDate)) {
                throw new CafeException(CafeErrorCode.DUPLICATED_SCHEDULE_DATE);
            }

            if (Boolean.TRUE.equals(operatingHour.isOpen())) {
                validateOperatingTime(
                        operatingHour.openTime(),
                        operatingHour.closeTime(),
                        operatingHour.lastOrderTime()
                );
            }
        }
    }

    private void validateOperatingTime(
            LocalTime openTime,
            LocalTime closeTime,
            LocalTime lastOrderTime
    ) {
        if (openTime == null || closeTime == null || lastOrderTime == null) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }

        if (
                lastOrderTime.isBefore(openTime)
                || lastOrderTime.isAfter(closeTime)
                || closeTime.isBefore(openTime)
        ) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }
    }

    private void validateDailySchedules(
            List<CafeReqDTO.DailySchedule> schedules,
            YearMonth targetMonth
    ) {
        Set<LocalDate> workDates = new HashSet<>();

        for (CafeReqDTO.DailySchedule schedule : schedules) {
            LocalDate workDate = schedule.workDate();

            if (workDate == null || !YearMonth.from(workDate).equals(targetMonth)) {
                throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
            }

            if (!workDates.add(workDate)) {
                throw new CafeException(CafeErrorCode.DUPLICATED_SCHEDULE_DATE);
            }

            validateScheduleMaids(schedule.maids());
        }
    }

    private void validateScheduleMaids(
            List<CafeReqDTO.ScheduleMaid> maids
    ) {
        if (maids == null) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }

        Set<Long> maidProfileIds = new HashSet<>();

        for (CafeReqDTO.ScheduleMaid maid : maids) {
            if (
                    maid.maidProfileId() == null
                    || maid.startTime() == null
                    || maid.endTime() == null
            ) {
                throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
            }

            if (!maidProfileIds.add(maid.maidProfileId())) {
                throw new CafeException(CafeErrorCode.DUPLICATED_SCHEDULE_MAID);
            }

            if (!maid.startTime().isBefore(maid.endTime())) {
                throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
            }
        }
    }
}

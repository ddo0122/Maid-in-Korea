package com.example.backend.domain.cafe.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class CafeReqDTO {

    public record UpsertMonthlySchedule(
            @NotNull(message = "스케줄 연도는 필수입니다.")
            Integer year,

            @NotNull(message = "스케줄 월은 필수입니다.")
            Integer month,

            @NotNull(message = "운영시간 목록은 필수입니다.")
            @Valid
            List<OperatingHour> operatingHours,

            @NotNull(message = "근무 스케줄 목록은 필수입니다.")
            @Valid
            List<DailySchedule> schedules
    ) {}

    public record PatchMonthlySchedule(
            @Valid
            List<OperatingHour> operatingHours,

            @Valid
            List<DailySchedule> schedules
    ) {}

    public record OperatingHour(
            @NotNull(message = "영업일은 필수입니다.")
            LocalDate businessDate,

            @NotNull(message = "영업 여부는 필수입니다.")
            Boolean isOpen,

            LocalTime openTime,

            LocalTime closeTime,

            LocalTime lastOrderTime,

            String note
    ) {}

    public record DailySchedule(
            @NotNull(message = "근무일은 필수입니다.")
            LocalDate workDate,

            @NotNull(message = "근무 메이드 목록은 필수입니다.")
            @Valid
            List<ScheduleMaid> maids
    ) {}

    public record ScheduleMaid(
            @NotNull(message = "메이드 프로필 ID는 필수입니다.")
            Long maidProfileId,

            @NotNull(message = "근무 시작 시간은 필수입니다.")
            LocalTime startTime,

            @NotNull(message = "근무 종료 시간은 필수입니다.")
            LocalTime endTime,

            String note
    ) {}

    public record CreateMenu(
            @NotBlank(message = "메뉴 이름은 필수입니다.")
            String name,

            @NotNull(message = "메뉴 가격은 필수입니다.")
            @PositiveOrZero(message = "메뉴 가격은 0원 이상이어야 합니다.")
            Integer price,

            String image
    ) {}

    public record UpdateMenu(
            String name,

            @PositiveOrZero(message = "메뉴 가격은 0원 이상이어야 합니다.")
            Integer price,

            String image
    ) {
        @AssertTrue(message = "메뉴 이름은 공백일 수 없습니다.")
        public boolean isNameValid() {
            return name == null || !name.isBlank();
        }
    }
}

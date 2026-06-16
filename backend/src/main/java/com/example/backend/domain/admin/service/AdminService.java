package com.example.backend.domain.admin.service;

import com.example.backend.domain.admin.converter.AdminConverter;
import com.example.backend.domain.admin.dto.AdminReqDTO;
import com.example.backend.domain.admin.dto.AdminResDTO;
import com.example.backend.domain.admin.entity.Admin;
import com.example.backend.domain.admin.exception.AdminException;
import com.example.backend.domain.admin.exception.code.AdminErrorCode;
import com.example.backend.domain.admin.repository.AdminRepository;
import com.example.backend.domain.cafe.converter.CafeConverter;
import com.example.backend.domain.cafe.converter.CafeMonthlyScheduleConverter;
import com.example.backend.domain.cafe.dto.CafeReqDTO;
import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMaid;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.entity.CafeOperatingHour;
import com.example.backend.domain.cafe.entity.CafeSchedule;
import com.example.backend.domain.cafe.entity.CafeScheduleMaid;
import com.example.backend.domain.cafe.entity.Menu;
import com.example.backend.domain.cafe.enums.CafeMonthlyScheduleStatus;
import com.example.backend.domain.cafe.exception.CafeException;
import com.example.backend.domain.cafe.exception.code.CafeErrorCode;
import com.example.backend.domain.cafe.repository.CafeMaidRepository;
import com.example.backend.domain.cafe.repository.CafeMonthlyScheduleRepository;
import com.example.backend.domain.cafe.repository.CafeOperatingHourRepository;
import com.example.backend.domain.cafe.repository.CafeScheduleMaidRepository;
import com.example.backend.domain.cafe.repository.CafeScheduleRepository;
import com.example.backend.domain.cafe.repository.MenuRepository;
import com.example.backend.domain.cafe.validator.CafeMonthlyScheduleValidator;
import com.example.backend.domain.maid.entity.MaidProfile;
import com.example.backend.global.security.entity.AuthAdmin;
import com.example.backend.global.security.service.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private static final ZoneId SERVICE_ZONE_ID = ZoneId.of("Asia/Seoul");

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final CafeMonthlyScheduleRepository monthlyScheduleRepository;
    private final CafeOperatingHourRepository operatingHourRepository;
    private final CafeScheduleRepository scheduleRepository;
    private final CafeScheduleMaidRepository scheduleMaidRepository;
    private final CafeMaidRepository cafeMaidRepository;
    private final MenuRepository menuRepository;
    private final CafeMonthlyScheduleValidator monthlyScheduleValidator;

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

    public AdminResDTO.Me getMe(
            AuthAdmin authAdmin
    ) {
        validateAdmin(authAdmin);

        Admin admin = adminRepository.findByIdAndDeletedAtIsNullFetchCafeAndMenus(authAdmin.getAdmin().getId())
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_NOT_FOUND));

        if (admin.getCafe() == null) {
            throw new AdminException(AdminErrorCode.ADMIN_CAFE_NOT_FOUND);
        }

        return AdminConverter.toMe(admin);
    }

    @Transactional
    public void updateCafe(
            AuthAdmin authAdmin,
            AdminReqDTO.UpdateCafe dto
    ) {
        validateAdmin(authAdmin);

        Admin admin = adminRepository.findByIdAndDeletedAtIsNullFetchCafe(authAdmin.getAdmin().getId())
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_NOT_FOUND));

        if (admin.getCafe() == null) {
            throw new AdminException(AdminErrorCode.ADMIN_CAFE_NOT_FOUND);
        }
        Cafe cafe = admin.getCafe();

        validateCafeInfo(cafe, dto);
        cafe.patchAdminCafeInfo(
                trimNullable(dto.name()),
                trimNullable(dto.description()),
                trimNullable(dto.phone()),
                trimNullable(dto.website()),
                dto.defaultOpenTime(),
                dto.defaultCloseTime(),
                dto.defaultLastOrderTime(),
                trimNullable(dto.regularClosedDays())
        );
    }

    @Transactional(readOnly = true)
    public CafeResDTO.MonthlyScheduleInfo getAdminMonthlySchedule(
            AuthAdmin authAdmin,
            Integer year,
            Integer month
    ) {
        Admin admin = findAdminWithCafe(authAdmin);

        CafeMonthlySchedule monthlySchedule = monthlyScheduleRepository
                .findByCafeAndYearAndMonth(admin.getCafe(), year, month)
                .orElseThrow(() -> new CafeException(CafeErrorCode.MONTHLY_SCHEDULE_NOT_FOUND));

        return CafeConverter.toMonthlySchedule(monthlySchedule);
    }

    @Transactional
    public void saveMonthlyScheduleDraft(
            AuthAdmin authAdmin,
            CafeReqDTO.UpsertMonthlySchedule dto
    ) {
        Admin admin = findAdminWithCafe(authAdmin);
        Cafe cafe = admin.getCafe();
        YearMonth targetMonth = monthlyScheduleValidator.validate(dto);
        Map<Long, MaidProfile> maidProfiles = getCafeMaidProfileMap(cafe);

        monthlyScheduleValidator.validateMaidProfiles(dto, maidProfiles);

        CafeMonthlySchedule monthlySchedule = monthlyScheduleRepository
                .findByCafeAndYearAndMonth(cafe, dto.year(), dto.month())
                .orElseGet(() -> monthlyScheduleRepository.save(
                        CafeMonthlyScheduleConverter.toDraft(cafe, targetMonth)
                ));

        monthlyScheduleRepository.updateStatus(
                monthlySchedule.getId(),
                CafeMonthlyScheduleStatus.DRAFT,
                null
        );

        replaceMonthlyScheduleDetails(monthlySchedule, dto, maidProfiles);
    }

    @Transactional
    public void patchMonthlyScheduleDraft(
            AuthAdmin authAdmin,
            Long scheduleId,
            CafeReqDTO.PatchMonthlySchedule dto
    ) {
        Admin admin = findAdminWithCafe(authAdmin);

        CafeMonthlySchedule monthlySchedule = monthlyScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new CafeException(CafeErrorCode.MONTHLY_SCHEDULE_NOT_FOUND));

        validateMonthlyScheduleOwner(admin, monthlySchedule);

        CafeReqDTO.UpsertMonthlySchedule mergedDto = mergeMonthlySchedulePatch(monthlySchedule, dto);
        YearMonth targetMonth = monthlyScheduleValidator.validate(mergedDto);
        if (
                !monthlySchedule.getYear().equals(targetMonth.getYear())
                || !monthlySchedule.getMonth().equals(targetMonth.getMonthValue())
        ) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }

        Map<Long, MaidProfile> maidProfiles = getCafeMaidProfileMap(admin.getCafe());
        monthlyScheduleValidator.validateMaidProfiles(mergedDto, maidProfiles);

        monthlyScheduleRepository.updateStatus(
                monthlySchedule.getId(),
                CafeMonthlyScheduleStatus.DRAFT,
                null
        );

        replaceMonthlyScheduleDetails(monthlySchedule, mergedDto, maidProfiles);
    }

    @Transactional
    public void publishMonthlySchedule(
            AuthAdmin authAdmin,
            Long scheduleId
    ) {
        Admin admin = findAdminWithCafe(authAdmin);

        CafeMonthlySchedule monthlySchedule = monthlyScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new CafeException(CafeErrorCode.MONTHLY_SCHEDULE_NOT_FOUND));

        validateMonthlyScheduleOwner(admin, monthlySchedule);

        monthlyScheduleValidator.validatePublishable(monthlySchedule);

        monthlyScheduleRepository.updateStatus(
                monthlySchedule.getId(),
                CafeMonthlyScheduleStatus.PUBLISHED,
                LocalDateTime.now(SERVICE_ZONE_ID)
        );
    }

    @Transactional
    public void addMenus(
            AuthAdmin authAdmin,
            CafeReqDTO.CreateMenu dto
    ) {
        Admin admin = findAdminWithCafe(authAdmin);
        menuRepository.save(AdminConverter.toMenu(admin.getCafe(), dto));
    }

    @Transactional
    public void updateMenus(
            AuthAdmin authAdmin,
            Long menuId,
            CafeReqDTO.UpdateMenu dto
    ) {
        Admin admin = findAdminWithCafe(authAdmin);
        Cafe cafe = admin.getCafe();

        Menu menu = menuRepository.findByIdAndCafe(menuId, cafe)
                .orElseThrow(() -> new CafeException(CafeErrorCode.MENU_NOT_FOUND));

        AdminConverter.patchMenu(menu, dto);
    }

    @Transactional
    public void deleteMenus(
            AuthAdmin authAdmin,
            Long menuId
    ) {
        Admin admin = findAdminWithCafe(authAdmin);
        Cafe cafe = admin.getCafe();

        Menu menu = menuRepository.findByIdAndCafe(menuId, cafe)
                .orElseThrow(() -> new CafeException(CafeErrorCode.MENU_NOT_FOUND));

        menuRepository.delete(menu);
    }

    private void validateAdmin(
            AuthAdmin authAdmin
    ) {
        if (authAdmin == null || authAdmin.getAdmin() == null) {
            throw new AdminException(AdminErrorCode.FORBIDDEN_ADMIN_ONLY);
        }
    }

    private Admin findAdminWithCafe(
            AuthAdmin authAdmin
    ) {
        validateAdmin(authAdmin);

        Admin admin = adminRepository.findByIdAndDeletedAtIsNullFetchCafe(authAdmin.getAdmin().getId())
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_NOT_FOUND));

        if (admin.getCafe() == null) {
            throw new AdminException(AdminErrorCode.ADMIN_CAFE_NOT_FOUND);
        }

        return admin;
    }

    private void validateMonthlyScheduleOwner(
            Admin admin,
            CafeMonthlySchedule monthlySchedule
    ) {
        if (!monthlySchedule.getCafe().getId().equals(admin.getCafe().getId())) {
            throw new AdminException(AdminErrorCode.FORBIDDEN_ADMIN_ONLY);
        }
    }

    private Map<Long, MaidProfile> getCafeMaidProfileMap(
            Cafe cafe
    ) {
        return cafeMaidRepository.findAllByCafeFetchMaidProfile(cafe).stream()
                .map(CafeMaid::getMaidProfile)
                .collect(Collectors.toMap(
                        MaidProfile::getId,
                        Function.identity()
                ));
    }

    private CafeReqDTO.UpsertMonthlySchedule mergeMonthlySchedulePatch(
            CafeMonthlySchedule monthlySchedule,
            CafeReqDTO.PatchMonthlySchedule dto
    ) {
        if (dto == null) {
            throw new CafeException(CafeErrorCode.INVALID_MONTHLY_SCHEDULE);
        }

        List<CafeReqDTO.OperatingHour> operatingHours = dto.operatingHours() != null
                ? dto.operatingHours()
                : monthlySchedule.getOperatingHours().stream()
                        .map(this::toOperatingHourDto)
                        .toList();
        List<CafeReqDTO.DailySchedule> schedules = dto.schedules() != null
                ? dto.schedules()
                : monthlySchedule.getSchedules().stream()
                        .map(this::toDailyScheduleDto)
                        .toList();

        return new CafeReqDTO.UpsertMonthlySchedule(
                monthlySchedule.getYear(),
                monthlySchedule.getMonth(),
                operatingHours,
                schedules
        );
    }

    private CafeReqDTO.OperatingHour toOperatingHourDto(
            CafeOperatingHour operatingHour
    ) {
        return new CafeReqDTO.OperatingHour(
                operatingHour.getBusinessDate(),
                operatingHour.getIsOpen(),
                operatingHour.getOpenTime(),
                operatingHour.getCloseTime(),
                operatingHour.getLastOrderTime(),
                operatingHour.getNote()
        );
    }

    private CafeReqDTO.DailySchedule toDailyScheduleDto(
            CafeSchedule schedule
    ) {
        return new CafeReqDTO.DailySchedule(
                schedule.getWorkDate(),
                schedule.getCafeScheduleMaids().stream()
                        .map(this::toScheduleMaidDto)
                        .toList()
        );
    }

    private CafeReqDTO.ScheduleMaid toScheduleMaidDto(
            CafeScheduleMaid scheduleMaid
    ) {
        return new CafeReqDTO.ScheduleMaid(
                scheduleMaid.getMaidProfile().getId(),
                scheduleMaid.getStartTime(),
                scheduleMaid.getEndTime(),
                scheduleMaid.getNote()
        );
    }

    private void replaceMonthlyScheduleDetails(
            CafeMonthlySchedule monthlySchedule,
            CafeReqDTO.UpsertMonthlySchedule dto,
            Map<Long, MaidProfile> maidProfiles
    ) {
        Long monthlyScheduleId = monthlySchedule.getId();

        scheduleMaidRepository.deleteAllPhysicallyByMonthlyScheduleId(monthlyScheduleId);
        scheduleRepository.deleteAllPhysicallyByMonthlyScheduleId(monthlyScheduleId);
        operatingHourRepository.deleteAllPhysicallyByMonthlyScheduleId(monthlyScheduleId);

        operatingHourRepository.saveAll(
                CafeMonthlyScheduleConverter.toOperatingHours(monthlySchedule, dto.operatingHours())
        );

        for (CafeReqDTO.DailySchedule dailySchedule : dto.schedules()) {
            CafeSchedule schedule = scheduleRepository.save(
                    CafeMonthlyScheduleConverter.toSchedule(monthlySchedule, dailySchedule)
            );

            scheduleMaidRepository.saveAll(
                    CafeMonthlyScheduleConverter.toScheduleMaids(
                            schedule,
                            dailySchedule.maids(),
                            maidProfiles
                    )
            );
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

        boolean hasAnyTimeInfo = defaultOpenTime != null
                || defaultCloseTime != null
                || defaultLastOrderTime != null;
        boolean hasFullTimeInfo = defaultOpenTime != null
                && defaultCloseTime != null
                && defaultLastOrderTime != null;

        if (!hasAnyTimeInfo) {
            return;
        }

        if (!hasFullTimeInfo) {
            throw new AdminException(AdminErrorCode.INVALID_CAFE_INFO);
        }

        if (
                defaultLastOrderTime.isBefore(defaultOpenTime)
                || defaultLastOrderTime.isAfter(defaultCloseTime)
                || defaultCloseTime.isBefore(defaultOpenTime)
        ) {
            throw new AdminException(AdminErrorCode.INVALID_CAFE_INFO);
        }
    }

    private String trimNullable(
            String value
    ) {
        return value != null ? value.trim() : null;
    }
}

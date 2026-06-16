package com.example.backend.domain.cafe.service;

import com.example.backend.domain.admin.entity.Admin;
import com.example.backend.domain.admin.exception.AdminException;
import com.example.backend.domain.admin.exception.code.AdminErrorCode;
import com.example.backend.domain.admin.repository.AdminRepository;
import com.example.backend.domain.cafe.converter.CafeConverter;
import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMaidInvitation;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.entity.CafeOperatingHour;
import com.example.backend.domain.cafe.enums.CafeMaidInvitationStatus;
import com.example.backend.domain.cafe.enums.CafeMonthlyScheduleStatus;
import com.example.backend.domain.cafe.exception.CafeException;
import com.example.backend.domain.cafe.exception.code.CafeErrorCode;
import com.example.backend.domain.cafe.repository.CafeMaidInvitationRepository;
import com.example.backend.domain.cafe.repository.CafeMaidRepository;
import com.example.backend.domain.cafe.repository.CafeMonthlyScheduleRepository;
import com.example.backend.domain.cafe.repository.CafeRepository;
import com.example.backend.domain.maid.entity.MaidProfile;
import com.example.backend.domain.maid.exception.MaidException;
import com.example.backend.domain.maid.exception.code.MaidErrorCode;
import com.example.backend.domain.maid.repository.MaidProfileRepository;
import com.example.backend.global.common.dto.CursorPaginationResDTO;
import com.example.backend.global.security.entity.AuthAdmin;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CafeService {

    private static final ZoneId SERVICE_ZONE_ID = ZoneId.of("Asia/Seoul");
    private static final int ADMIN_INVITATION_PAGE_SIZE = 20;

    private final CafeRepository cafeRepository;
    private final CafeMonthlyScheduleRepository monthlyScheduleRepository;
    private final AdminRepository adminRepository;
    private final MaidProfileRepository maidProfileRepository;
    private final CafeMaidRepository cafeMaidRepository;
    private final CafeMaidInvitationRepository cafeMaidInvitationRepository;

    @Transactional(readOnly = true)
    public List<CafeResDTO.HomeInfo> getHomeCafes() {
        LocalDate today = LocalDate.now(SERVICE_ZONE_ID);

        return cafeRepository.findAll().stream()
                .map(cafe -> CafeConverter.toHomeInfo(cafe, findTodayOperatingHour(cafe, today)))
                .toList();
    }

    @Transactional(readOnly = true)
    public CafeResDTO.DetailInfo getCafeDetail(
            Long cafeId
    ) {
        LocalDate today = LocalDate.now(SERVICE_ZONE_ID);
        Cafe cafe = cafeRepository.findById(cafeId)
                .orElseThrow(() -> new CafeException(CafeErrorCode.CAFE_NOT_FOUND));
        Optional<CafeMonthlySchedule> currentMonthSchedule = findPublishedMonthlySchedule(cafe, today);

        return CafeConverter.toDetailInfo(
                cafe,
                findTodayOperatingHour(cafe, today),
                currentMonthSchedule
        );
    }

    @Transactional(readOnly = true)
    public CafeResDTO.MonthlyScheduleInfo getPublishedMonthlySchedule(
            Long cafeId,
            Integer year,
            Integer month
    ) {
        CafeMonthlySchedule monthlySchedule = monthlyScheduleRepository
                .findByCafeIdAndYearAndMonthAndStatus(
                        cafeId,
                        year,
                        month,
                        CafeMonthlyScheduleStatus.PUBLISHED
                )
                .orElseThrow(() -> new CafeException(CafeErrorCode.MONTHLY_SCHEDULE_NOT_FOUND));

        return CafeConverter.toMonthlySchedule(monthlySchedule);
    }

    @Transactional
    public void inviteMaid(
            AuthAdmin authAdmin,
            Long maidProfileId
    ) {
        Admin admin = findAdminWithCafe(authAdmin);
        Cafe cafe = admin.getCafe();

        MaidProfile maidProfile = maidProfileRepository.findById(maidProfileId)
                .orElseThrow(() -> new MaidException(MaidErrorCode.PROFILE_NOT_FOUND));

        if (cafeMaidRepository.existsByMaidProfileId(maidProfile.getId())) {
            throw new CafeException(CafeErrorCode.CAFE_MAID_ALREADY_EXISTS);
        }

        boolean hasPendingInvitation = cafeMaidInvitationRepository.existsByCafeAndMaidProfileAndStatus(
                cafe,
                maidProfile,
                CafeMaidInvitationStatus.PENDING
        );
        if (hasPendingInvitation) {
            throw new CafeException(CafeErrorCode.DUPLICATED_MAID_INVITATION);
        }

        cafeMaidInvitationRepository.save(CafeConverter.toCafeMaidInvitation(cafe, maidProfile, admin));
    }

    @Transactional(readOnly = true)
    public CursorPaginationResDTO<CafeResDTO.MaidInvitationInfo> getAdminMaidInvitations(
            AuthAdmin authAdmin,
            String cursor
    ) {
        Admin admin = findAdminWithCafe(authAdmin);
        Long cursorId = parseCursor(cursor);

        List<CafeMaidInvitation> invitations = cafeMaidInvitationRepository.findAllByCafeAndCursor(
                admin.getCafe(),
                cursorId,
                PageRequest.of(0, ADMIN_INVITATION_PAGE_SIZE + 1)
        );

        boolean hasNext = invitations.size() > ADMIN_INVITATION_PAGE_SIZE;
        List<CafeMaidInvitation> pageInvitations = hasNext
                ? invitations.subList(0, ADMIN_INVITATION_PAGE_SIZE)
                : invitations;
        String nextCursor = hasNext
                ? String.valueOf(pageInvitations.get(pageInvitations.size() - 1).getId())
                : null;

        return CafeConverter.toMaidInvitationPage(
                pageInvitations,
                hasNext,
                nextCursor,
                ADMIN_INVITATION_PAGE_SIZE
        );
    }

    private Admin findAdminWithCafe(
            AuthAdmin authAdmin
    ) {
        if (authAdmin == null || authAdmin.getAdmin() == null) {
            throw new AdminException(AdminErrorCode.FORBIDDEN_ADMIN_ONLY);
        }

        Admin admin = adminRepository.findByIdAndDeletedAtIsNullFetchCafe(authAdmin.getAdmin().getId())
                .orElseThrow(() -> new AdminException(AdminErrorCode.ADMIN_NOT_FOUND));

        if (admin.getCafe() == null) {
            throw new AdminException(AdminErrorCode.ADMIN_CAFE_NOT_FOUND);
        }

        return admin;
    }

    private Long parseCursor(
            String cursor
    ) {
        if (cursor == null || cursor.isBlank()) {
            return null;
        }

        try {
            return Long.parseLong(cursor);
        } catch (NumberFormatException e) {
            throw new CafeException(CafeErrorCode.INVALID_CURSOR);
        }
    }

    private Optional<CafeMonthlySchedule> findPublishedMonthlySchedule(
            Cafe cafe,
            LocalDate today
    ) {
        return cafe.getMonthlySchedules().stream()
                .filter(monthlySchedule -> isPublishedMonthlySchedule(monthlySchedule, today))
                .max(Comparator.comparing(CafeMonthlySchedule::getId));
    }

    private Optional<CafeOperatingHour> findTodayOperatingHour(
            Cafe cafe,
            LocalDate today
    ) {
        return findPublishedMonthlySchedule(cafe, today).stream()
                .flatMap(monthlySchedule -> monthlySchedule.getOperatingHours().stream())
                .filter(operatingHour -> today.equals(operatingHour.getBusinessDate()))
                .max(Comparator.comparing(CafeOperatingHour::getId));
    }

    private boolean isPublishedMonthlySchedule(
            CafeMonthlySchedule monthlySchedule,
            LocalDate today
    ) {
        return monthlySchedule.getStatus() == CafeMonthlyScheduleStatus.PUBLISHED
                && monthlySchedule.getYear().equals(today.getYear())
                && monthlySchedule.getMonth().equals(today.getMonthValue());
    }
}

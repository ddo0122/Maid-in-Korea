package com.example.backend.domain.cafe.service;

import com.example.backend.domain.cafe.converter.CafeConverter;
import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.entity.CafeOperatingHour;
import com.example.backend.domain.cafe.enums.CafeMonthlyScheduleStatus;
import com.example.backend.domain.cafe.exception.CafeException;
import com.example.backend.domain.cafe.exception.code.CafeErrorCode;
import com.example.backend.domain.cafe.repository.CafeRepository;
import lombok.RequiredArgsConstructor;
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

    private final CafeRepository cafeRepository;

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

    private Optional<CafeOperatingHour> findTodayOperatingHour(
            Cafe cafe,
            LocalDate today
    ) {
        return findPublishedMonthlySchedule(cafe, today).stream()
                .flatMap(monthlySchedule -> monthlySchedule.getOperatingHours().stream())
                .filter(operatingHour -> today.equals(operatingHour.getBusinessDate()))
                .max(Comparator.comparing(CafeOperatingHour::getId));
    }

    private Optional<CafeMonthlySchedule> findPublishedMonthlySchedule(
            Cafe cafe,
            LocalDate today
    ) {
        return cafe.getMonthlySchedules().stream()
                .filter(monthlySchedule -> isPublishedMonthlySchedule(monthlySchedule, today))
                .max(Comparator.comparing(CafeMonthlySchedule::getId));
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

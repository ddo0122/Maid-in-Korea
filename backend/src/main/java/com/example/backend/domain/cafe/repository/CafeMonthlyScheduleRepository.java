package com.example.backend.domain.cafe.repository;

import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.CafeMonthlySchedule;
import com.example.backend.domain.cafe.enums.CafeMonthlyScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface CafeMonthlyScheduleRepository extends JpaRepository<CafeMonthlySchedule, Long> {

    Optional<CafeMonthlySchedule> findByCafeAndYearAndMonth(
            Cafe cafe,
            Integer year,
            Integer month
    );

    Optional<CafeMonthlySchedule> findByCafeIdAndYearAndMonthAndStatus(
            Long cafeId,
            Integer year,
            Integer month,
            CafeMonthlyScheduleStatus status
    );

    @Modifying
    @Query("""
            UPDATE CafeMonthlySchedule monthlySchedule
            SET monthlySchedule.status = :status,
                monthlySchedule.publishedAt = :publishedAt
            WHERE monthlySchedule.id = :id
            """)
    void updateStatus(
            Long id,
            CafeMonthlyScheduleStatus status,
            LocalDateTime publishedAt
    );
}

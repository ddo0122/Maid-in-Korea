package com.example.backend.domain.cafe.repository;

import com.example.backend.domain.cafe.entity.CafeScheduleMaid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CafeScheduleMaidRepository extends JpaRepository<CafeScheduleMaid, Long> {

    @Modifying
    @Query("""
            DELETE FROM CafeScheduleMaid scheduleMaid
            WHERE scheduleMaid.cafeSchedule.id IN (
                SELECT schedule.id
                FROM CafeSchedule schedule
                WHERE schedule.monthlySchedule.id = :monthlyScheduleId
            )
            """)
    void deleteAllPhysicallyByMonthlyScheduleId(Long monthlyScheduleId);
}

package com.example.backend.domain.cafe.repository;

import com.example.backend.domain.cafe.entity.CafeOperatingHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CafeOperatingHourRepository extends JpaRepository<CafeOperatingHour, Long> {

    @Modifying
    @Query("""
            DELETE FROM CafeOperatingHour operatingHour
            WHERE operatingHour.monthlySchedule.id = :monthlyScheduleId
            """)
    void deleteAllPhysicallyByMonthlyScheduleId(Long monthlyScheduleId);
}

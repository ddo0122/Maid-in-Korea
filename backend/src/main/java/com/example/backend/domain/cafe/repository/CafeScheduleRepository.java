package com.example.backend.domain.cafe.repository;

import com.example.backend.domain.cafe.entity.CafeSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CafeScheduleRepository extends JpaRepository<CafeSchedule, Long> {

    @Modifying
    @Query("""
            DELETE FROM CafeSchedule schedule
            WHERE schedule.monthlySchedule.id = :monthlyScheduleId
            """)
    void deleteAllPhysicallyByMonthlyScheduleId(Long monthlyScheduleId);
}

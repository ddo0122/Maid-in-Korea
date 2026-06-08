package com.example.backend.domain.cafe.entity;

import com.example.backend.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "cafe_operating_hour",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"monthly_schedule_id", "business_date"})
        }
)
@SQLDelete(sql = "UPDATE cafe_operating_hour SET deleted_at = current_timestamp WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class CafeOperatingHour extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monthly_schedule_id", nullable = false)
    private CafeMonthlySchedule monthlySchedule;

    @Column(name = "business_date", nullable = false)
    private LocalDate businessDate;

    @Column(name = "is_open", nullable = false)
    private Boolean isOpen;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;

    @Column(name = "last_order_time")
    private LocalTime lastOrderTime;

    @Column(columnDefinition = "TEXT")
    private String note;
}

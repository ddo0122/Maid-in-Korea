package com.example.backend.domain.cafe.entity;

import com.example.backend.domain.cafe.enums.CafeMonthlyScheduleStatus;
import com.example.backend.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "cafe_monthly_schedule",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"cafe_id", "schedule_year", "schedule_month"})
        }
)
@SQLDelete(sql = "UPDATE cafe_monthly_schedule SET deleted_at = current_timestamp WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class CafeMonthlySchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_id", nullable = false)
    private Cafe cafe;

    @Column(name = "schedule_year", nullable = false)
    private Integer year;

    @Column(name = "schedule_month", nullable = false)
    private Integer month;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CafeMonthlyScheduleStatus status;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Builder.Default
    @OneToMany(mappedBy = "monthlySchedule")
    private List<CafeOperatingHour> operatingHours = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "monthlySchedule")
    private List<CafeSchedule> schedules = new ArrayList<>();
}

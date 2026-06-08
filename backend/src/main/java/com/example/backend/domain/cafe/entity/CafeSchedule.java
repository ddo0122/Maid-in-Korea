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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "cafe_schedule",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"monthly_schedule_id", "work_date"})
        }
)
@SQLDelete(sql = "UPDATE cafe_schedule SET deleted_at = current_timestamp WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class CafeSchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monthly_schedule_id", nullable = false)
    private CafeMonthlySchedule monthlySchedule;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Builder.Default
    @OneToMany(mappedBy = "cafeSchedule")
    private List<CafeScheduleMaid> cafeScheduleMaids = new ArrayList<>();
}

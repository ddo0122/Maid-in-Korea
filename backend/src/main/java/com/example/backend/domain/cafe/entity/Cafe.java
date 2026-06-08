package com.example.backend.domain.cafe.entity;

import com.example.backend.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cafe")
@SQLDelete(sql = "UPDATE cafe SET deleted_at = current_timestamp WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Cafe extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String area;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(name = "cover_image", columnDefinition = "TEXT")
    private String coverImage;

    @Column
    private String phone;

    @Column
    private String website;

    @Column(nullable = false)
    private Double rating;

    @Column
    private String distance;

    @Column(name = "default_open_time")
    private LocalTime defaultOpenTime;

    @Column(name = "default_close_time")
    private LocalTime defaultCloseTime;

    @Column(name = "default_last_order_time")
    private LocalTime defaultLastOrderTime;

    @Column(name = "regular_closed_days")
    private String regularClosedDays;

    @Builder.Default
    @OneToMany(mappedBy = "cafe")
    private List<CafeTag> cafeTags = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "cafe")
    private List<Menu> menus = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "cafe")
    private List<CafeMonthlySchedule> monthlySchedules = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "cafe")
    private List<CafeMaid> cafeMaids = new ArrayList<>();
}

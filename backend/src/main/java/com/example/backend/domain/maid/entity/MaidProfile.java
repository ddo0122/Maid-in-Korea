package com.example.backend.domain.maid.entity;

import com.example.backend.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "maid_profile")
@SQLDelete(sql = "UPDATE maid_profile SET deleted_at = current_timestamp WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class MaidProfile extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Maid 엔티티에는 profiles 컬렉션을 안줘도 됨
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maid_id", nullable = false)
    private Maid maid;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column
    private String serviceArea;

    @Column
    private String instagram;

    @Column
    private String x;

    @Column(nullable = false)
    private Boolean isActive;

    public void update(
            String name,
            String description,
            String serviceArea,
            String instagram,
            String x
    ) {
        if (name != null) {
            this.name = name;
        }
        if (description != null) {
            this.description = description;
        }
        if (serviceArea != null) {
            this.serviceArea = serviceArea;
        }
        if (instagram != null) {
            this.instagram = instagram;
        }
        if (x != null) {
            this.x = x;
        }
    }

    public void deactivate() {
        this.isActive = false;
    }
}

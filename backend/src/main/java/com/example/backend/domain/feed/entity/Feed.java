package com.example.backend.domain.feed.entity;

import com.example.backend.domain.maid.entity.MaidProfile;
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
@Table(name = "feed")
@SQLDelete(sql = "UPDATE feed SET deleted_at = current_timestamp WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Feed extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maid_profile_id", nullable = false)
    private MaidProfile maidProfile;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "like_count", nullable = false)
    private Integer likeCount;

    public void patch(
            String description
    ) {
        if (description != null) {
            this.description = description;
        }
    }
}

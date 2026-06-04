package com.example.backend.domain.article.repository;

import com.example.backend.domain.article.entity.Article;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query("""
            SELECT a
            FROM Article a
            JOIN FETCH a.member
            WHERE (:cursor IS NULL OR a.id < :cursor)
            ORDER BY a.id DESC
            """)
    List<Article> findAllByCursor(
            @Param("cursor") Long cursor,
            Pageable pageable
    );
}

package com.example.backend.domain.article.service;

import com.example.backend.domain.article.converter.ArticleConverter;
import com.example.backend.domain.article.dto.ArticleReqDTO;
import com.example.backend.domain.article.dto.ArticleResDTO;
import com.example.backend.domain.article.entity.Article;
import com.example.backend.domain.article.exception.ArticleException;
import com.example.backend.domain.article.exception.code.ArticleErrorCode;
import com.example.backend.domain.article.repository.ArticleRepository;
import com.example.backend.global.common.dto.CursorPaginationResDTO;
import com.example.backend.global.security.entity.AuthMember;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Transactional
    public ArticleResDTO.Created createArticle(
            AuthMember authMember,
            ArticleReqDTO.CreateInfo dto
    ) {
        Article article = articleRepository.save(
                ArticleConverter.toArticle(authMember.getMember(), dto)
        );
        return ArticleConverter.toCreated(article);
    }

    @Transactional(readOnly = true)
    public CursorPaginationResDTO<ArticleResDTO.Detail> getArticles(
            String cursor,
            Integer size
    ) {
        int pageSize = normalizePageSize(size);
        Long cursorId = parseCursor(cursor);

        List<Article> articles = articleRepository.findAllByCursor(
                cursorId,
                PageRequest.of(0, pageSize + 1)
        );

        boolean hasNext = articles.size() > pageSize;
        List<Article> pageArticles = hasNext ? articles.subList(0, pageSize) : articles;
        String nextCursor = hasNext
                ? String.valueOf(pageArticles.get(pageArticles.size() - 1).getId())
                : null;

        return CursorPaginationResDTO.<ArticleResDTO.Detail>builder()
                .data(pageArticles.stream()
                        .map(ArticleConverter::toDetail)
                        .toList())
                .hasNext(hasNext)
                .nextCursor(nextCursor)
                .pageSize(pageSize)
                .build();
    }

    private int normalizePageSize(Integer size) {
        if (size == null || size < 1) {
            return 10;
        }
        return Math.min(size, 50);
    }

    private Long parseCursor(String cursor) {
        if (cursor == null || cursor.isBlank()) {
            return null;
        }
        try {
            return Long.parseLong(cursor);
        } catch (NumberFormatException e) {
            throw new ArticleException(ArticleErrorCode.INVALID_CURSOR);
        }
    }

    @Transactional
    public void updateArticle(
            Long articleId,
            ArticleReqDTO.UpdateInfo dto,
            AuthMember authMember
    ) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.ARTICLE_NOT_FOUND));

        validateArticleOwner(article, authMember);
        ArticleConverter.patchArticle(article, dto);
    }

    @Transactional
    public void deleteArticle(
            Long articleId,
            AuthMember authMember
    ) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.ARTICLE_NOT_FOUND));

        validateArticleOwner(article, authMember);
        articleRepository.delete(article);
    }

    private void validateArticleOwner(
            Article article,
            AuthMember authMember
    ) {
        Long articleOwnerId = article.getMember().getId();
        Long requestMemberId = authMember.getMember().getId();

        if (!Objects.equals(articleOwnerId, requestMemberId)) {
            throw new ArticleException(ArticleErrorCode.FORBIDDEN_ARTICLE_OWNER_ONLY);
        }
    }
}

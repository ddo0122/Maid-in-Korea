package com.example.backend.domain.article.converter;

import com.example.backend.domain.article.dto.ArticleReqDTO;
import com.example.backend.domain.article.dto.ArticleResDTO;
import com.example.backend.domain.article.entity.Article;
import com.example.backend.domain.member.entity.Member;
import org.springframework.stereotype.Component;

@Component
public class ArticleConverter {

    private static final int NOT_IMPLEMENTED_COMMENT_COUNT = 0;

    public static Article toArticle(
            Member member,
            ArticleReqDTO.CreateInfo dto
    ) {
        return Article.builder()
                .member(member)
                .title(dto.title())
                .contents(dto.contents())
                .likeCount(0)
                .build();
    }

    public static ArticleResDTO.Created toCreated(
            Article article
    ) {
        return ArticleResDTO.Created.builder()
                .articleId(article.getId())
                .build();
    }

    public static Article patchArticle(
            Article article,
            ArticleReqDTO.UpdateInfo dto
    ) {
        article.patch(
                dto.title(),
                dto.contents()
        );
        return article;
    }

    public static ArticleResDTO.Detail toDetail(
            Article article
    ) {
        return ArticleResDTO.Detail.builder()
                .articleId(article.getId())
                .memberId(article.getMember().getId())
                .name(article.getMember().getName())
                .createAt(article.getCreateAt())
                .title(article.getTitle())
                .contents(article.getContents())
                .likeCount(article.getLikeCount())
                .comments(NOT_IMPLEMENTED_COMMENT_COUNT)
                .build();
    }
}

package com.example.backend.domain.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Size;

public class ArticleReqDTO {

    public record CreateInfo(
            @NotBlank(message = "제목은 필수입니다.")
            @Size(max = 100, message = "제목은 100자 이하로 입력해주세요.")
            String title,

            @NotBlank(message = "내용은 필수입니다.")
            String contents
    ) {
    }

    public record UpdateInfo(

            @Size(max = 100, message = "제목은 100자 이하로 입력해주세요.")
            String title,

            String contents
    ) {
        @AssertTrue(message = "제목은 공백일 수 없습니다.")
        public boolean isTitleValid() {
            return title == null || !title.isBlank();
        }

        @AssertTrue(message = "내용은 공백일 수 없습니다.")
        public boolean isContentsValid() {
            return contents == null || !contents.isBlank();
        }
    }
}

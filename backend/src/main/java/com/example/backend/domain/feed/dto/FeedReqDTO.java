package com.example.backend.domain.feed.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

public class FeedReqDTO {

    public record Upload(
            @NotBlank(message = "글 설명은 필수입니다.")
            String description
    ) {
    }

    public record UpdateInfo(
            String description
    ) {
        @AssertTrue(message = "글 설명은 공백일 수 없습니다.")
        public boolean isDescriptionValid() {
            return description == null || !description.isBlank();
        }
    }
}

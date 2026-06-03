package com.example.backend.domain.maid.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MaidReqDTO {

    public record ProfileInfo(
            @NotBlank(message = "프로필 이름은 필수입니다.")
            String name,

            String description,

            String serviceArea,

            String instagram,

            String x,

            @NotNull(message = "활성화 여부는 필수입니다.")
            Boolean isActive
    ) {}

    public record UpdateInfo(
            String name,

            String description,

            String serviceArea,

            String instagram,

            String x
    ) {
        @AssertTrue(message = "프로필 이름은 공백일 수 없습니다.")
        public boolean isNameValid() {
            return name == null || !name.isBlank();
        }
    }
}

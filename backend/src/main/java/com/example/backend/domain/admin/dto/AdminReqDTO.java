package com.example.backend.domain.admin.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalTime;

public class AdminReqDTO {

    public record Login(
            @NotBlank(message = "관리자 아이디 입력은 필수입니다.")
            String loginId,

            @NotBlank(message = "관리자 비밀번호 입력은 필수입니다.")
            String password
    ) {}

    public record Create(
            @NotBlank(message = "관리자 아이디 입력은 필수입니다.")
            String loginId,

            @NotBlank(message = "관리자 비밀번호 입력은 필수입니다.")
            @Size(min = 8)
            String password
    ) {}

    public record UpdateCafe(
            String name,

            String description,

            String phone,

            String website,

            @JsonProperty("default_open_time")
            @JsonAlias("defaultOpenTime")
            LocalTime defaultOpenTime,

            @JsonProperty("default_close_time")
            @JsonAlias("defaultCloseTime")
            LocalTime defaultCloseTime,

            @JsonProperty("default_last_order_time")
            @JsonAlias("defaultLastOrderTime")
            LocalTime defaultLastOrderTime,

            @JsonProperty("regular_closed_days")
            @JsonAlias("regularClosedDays")
            String regularClosedDays
    ) {
        @AssertTrue(message = "카페 이름은 공백일 수 없습니다.")
        public boolean isNameValid() {
            return name == null || !name.isBlank();
        }

        @AssertTrue(message = "카페 설명은 공백일 수 없습니다.")
        public boolean isDescriptionValid() {
            return description == null || !description.isBlank();
        }

        @AssertTrue(message = "카페 전화번호 형식이 올바르지 않습니다.")
        public boolean isPhoneValid() {
            return phone == null || phone.matches("^[0-9+\\-() ]{8,20}$");
        }

        @AssertTrue(message = "카페 웹사이트는 http:// 또는 https://로 시작해야 합니다.")
        public boolean isWebsiteValid() {
            return website == null || website.matches("^(https?://).+");
        }

        @AssertTrue(message = "카페 정기 휴무일은 공백일 수 없습니다.")
        public boolean isRegularClosedDaysValid() {
            return regularClosedDays == null || !regularClosedDays.isBlank();
        }
    }


}

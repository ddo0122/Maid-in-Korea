package com.example.backend.domain.member.dto;

import com.example.backend.domain.member.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MemberReqDTO {

    public record Login(
            @Email
            @NotNull(message = "이메일 입력은 필수입니다.")
            String email,

            @NotBlank
            @NotNull(message = "비밀번호 입력은 필수입니다.")
            String password
    ) {}

    public record SignupInfo(

            @NotNull(message = "유저 이름은 필수 입니다.")
            String name,

            @Email
            @NotNull(message = "유저 이메일은 필수 입니다.")
            String email,

            @NotBlank
            @Size(min = 8)
            @NotNull(message = "유저 비밀번호는 필수 입니다.")
            String password,

            @NotNull(message = "유저 성별은 필수 입니다.")
            Gender gender,

            @NotNull(message = "유저 생년월일은 필수 입니다.")
            String birth,

            @NotNull(message = "유저 주소는 필수 입니다.")
            String address,

            @NotNull(message = "유저 상세 주소는 필수 입니다.")
            String detailAddress
    ){}
}

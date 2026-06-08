package com.example.backend.domain.cafe.controller;

import com.example.backend.domain.cafe.dto.CafeResDTO;
import com.example.backend.domain.cafe.exception.code.CafeSuccessCode;
import com.example.backend.domain.cafe.service.CafeService;
import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cafes")
@RequiredArgsConstructor
public class CafeController {

    private final CafeService cafeService;

    @GetMapping("/v1/home")
    public ApiResponse<List<CafeResDTO.HomeInfo>> getHome(

    ) {
        BaseSuccessCode code = CafeSuccessCode.HOME_CAFES_OK;
        return ApiResponse.onSuccess(code, cafeService.getHomeCafes());
    }

    @GetMapping("/v1/{cafeId}")
    public ApiResponse<CafeResDTO.DetailInfo> getDetail(
            @PathVariable Long cafeId
    ) {
        BaseSuccessCode code = CafeSuccessCode.DETAIL_OK;
        return ApiResponse.onSuccess(code, cafeService.getCafeDetail(cafeId));
    }
}

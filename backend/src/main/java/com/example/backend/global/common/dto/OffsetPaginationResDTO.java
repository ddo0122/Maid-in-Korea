package com.example.backend.global.common.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record OffsetPaginationResDTO<T>(
        List<T> data,
        Integer pageNumber,
        Integer pageSize
) {}

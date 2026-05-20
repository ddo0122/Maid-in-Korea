package com.example.backend.global.common.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record CursorPaginationResDTO<T> (
    List<T> data,
    Boolean hasNext,
    String nextCursor,
    Integer pageSize
){}



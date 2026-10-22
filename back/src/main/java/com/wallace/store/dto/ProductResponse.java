package com.wallace.store.dto;

import com.wallace.store.model.Category;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String title,
        BigDecimal price,
        Integer quantity,
        Category category,
        String img,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

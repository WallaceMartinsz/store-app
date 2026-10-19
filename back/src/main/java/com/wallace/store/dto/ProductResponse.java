package com.wallace.store.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String title,
        BigDecimal price,
        Integer quantity,
        String img,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

package com.wallace.store.dto;

import java.time.LocalDateTime;

public record VisitorResponse(
        Long id,
        String name,
        String email,
        String phone,
        LocalDateTime createdAt,
        String accessToken
) {
}

package com.wallace.store.dto;

import java.time.Instant;

public record VisitorAuthResponse(
        String token,
        Instant expiresAt,
        VisitorResponse visitor
) {
}

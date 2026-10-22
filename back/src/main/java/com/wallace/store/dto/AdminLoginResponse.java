package com.wallace.store.dto;

import java.time.Instant;

public record AdminLoginResponse(
        String token,
        Instant expiresAt,
        String username,
        String role
) {
}

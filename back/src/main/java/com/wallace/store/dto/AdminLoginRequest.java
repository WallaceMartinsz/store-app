package com.wallace.store.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminLoginRequest(
        @NotBlank(message = "O usuario do admin e obrigatorio.")
        String username,

        @NotBlank(message = "A senha do admin e obrigatoria.")
        String password
) {
}

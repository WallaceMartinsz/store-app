package com.wallace.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VisitorLoginRequest(
        @NotBlank(message = "O e-mail do visitante e obrigatorio.")
        @Email(message = "Informe um e-mail valido.")
        @Size(max = 160, message = "O e-mail deve ter no maximo 160 caracteres.")
        String email
) {
}

package com.wallace.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VisitorRequest(
        @NotBlank(message = "O nome do visitante e obrigatorio.")
        @Size(max = 120, message = "O nome deve ter no maximo 120 caracteres.")
        String name,

        @NotBlank(message = "O e-mail do visitante e obrigatorio.")
        @Email(message = "Informe um e-mail valido.")
        @Size(max = 160, message = "O e-mail deve ter no maximo 160 caracteres.")
        String email,

        @Size(max = 30, message = "O telefone deve ter no maximo 30 caracteres.")
        String phone
) {
}

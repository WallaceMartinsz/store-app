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

        @NotBlank(message = "A senha do visitante é obrigatoria.")
        @Size(min = 8, max = 72, message = "A senha do visitante deve ter entre 8 e 72 caracteres.")
        String password,

        @Size(max = 11, message = "O telefone deve ter no maximo 11 caracteres.")
        String phone
) {
}

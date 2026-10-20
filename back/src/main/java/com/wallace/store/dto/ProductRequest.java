package com.wallace.store.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "O nome do produto e obrigatorio.")
        @Size(max = 120, message = "O nome deve ter no maximo 120 caracteres.")
        String name,

        @NotBlank(message = "A descricao do produto e obrigatoria.")
        @Size(max = 255, message = "A descricao deve ter no maximo 255 caracteres.")
        String title,

        @NotNull(message = "O preco do produto e obrigatorio.")
        @DecimalMin(value = "0.01", message = "O preco deve ser maior que zero.")
        BigDecimal price,

        @NotNull(message = "A quantidade do produto e obrigatoria.")
        @Min(value = 0, message = "A quantidade nao pode ser negativa.")
        Integer quantity,

        @NotBlank(message = "A URL da imagem e obrigatoria.")
        @Size(max = 2048, message = "A URL da imagem deve ter no maximo 2048 caracteres.")
        String img
) {
}

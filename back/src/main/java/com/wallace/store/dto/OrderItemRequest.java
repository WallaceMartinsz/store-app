package com.wallace.store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull(message = "O produto do item e obrigatorio.")
        Long productId,

        @NotNull(message = "A quantidade do item e obrigatoria.")
        @Min(value = 1, message = "A quantidade do item deve ser pelo menos 1.")
        Integer quantity
) {
}

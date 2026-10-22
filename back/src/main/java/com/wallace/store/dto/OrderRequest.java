package com.wallace.store.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotEmpty(message = "O pedido deve ter pelo menos um item.")
        List<@Valid OrderItemRequest> items
) {
}

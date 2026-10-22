package com.wallace.store.dto;

import com.wallace.store.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(
        @NotNull(message = "O status do pedido e obrigatorio.")
        OrderStatus status
) {
}

package com.wallace.store.dto;

import com.wallace.store.model.OrderStatus;
import com.wallace.store.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        Long visitorId,
        String visitorName,
        OrderStatus status,
        PaymentMethod paymentMethod,
        Integer installments,
        List<OrderItemResponse> items,
        BigDecimal shipping,
        BigDecimal total,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime paidAt,
        LocalDateTime shippedAt,
        LocalDateTime canceledAt
) {
}

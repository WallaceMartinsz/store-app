package com.wallace.store.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        String productImg,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {
}

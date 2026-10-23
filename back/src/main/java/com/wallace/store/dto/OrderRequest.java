package com.wallace.store.dto;

import com.wallace.store.model.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderRequest(
        @NotEmpty(message = "O pedido deve ter pelo menos um item.")
        List<@Valid OrderItemRequest> items,

        @NotNull(message = "Escolha a forma de pagamento.")
        PaymentMethod paymentMethod,

        // Mesmo limite anunciado na vitrine ("ate 10x sem juros")
        @Min(value = 1, message = "O numero de parcelas deve ser no minimo 1.")
        @Max(value = 10, message = "O parcelamento e de no maximo 10x.")
        Integer installments
) {
}

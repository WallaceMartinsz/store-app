package com.wallace.store.exception;

import java.util.UUID;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(UUID id) {
        super("Pedido com id " + id + " nao encontrado.");
    }
}

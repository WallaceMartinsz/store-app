package com.wallace.store.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("Produto com id " + id + " nao encontrado.");
    }
}

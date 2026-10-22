package com.wallace.store.exception;

public class VisitorNotFoundException extends RuntimeException {
    public VisitorNotFoundException(String email) {
        super("Visitante com e-mail " + email + " nao encontrado.");
    }

    public VisitorNotFoundException(Long id) {
        super("Visitante com id " + id + " nao encontrado.");
    }
}

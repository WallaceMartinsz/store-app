package com.wallace.store.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        this("E-mail ou senha invalidos.");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}

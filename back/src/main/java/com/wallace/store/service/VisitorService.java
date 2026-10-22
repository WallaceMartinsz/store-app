package com.wallace.store.service;

import com.wallace.store.dto.VisitorLoginRequest;
import com.wallace.store.dto.VisitorRequest;
import com.wallace.store.dto.VisitorResponse;
import com.wallace.store.exception.BusinessException;
import com.wallace.store.exception.InvalidCredentialsException;
import com.wallace.store.model.Visitor;
import com.wallace.store.repository.VisitorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VisitorService {
    private final VisitorRepository repository;
    private final PasswordEncoder passwordEncoder;

    public VisitorService(VisitorRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public VisitorResponse register(VisitorRequest request) {
        String email = normalizeEmail(request.email());

        if (repository.existsByEmailIgnoreCase(email)) {
            throw new BusinessException("Ja existe um visitante cadastrado com este e-mail.");
        }

        Visitor visitor = new Visitor();
        visitor.setName(request.name().trim());
        visitor.setEmail(email);
        visitor.setPassword(passwordEncoder.encode(request.password()));
        visitor.setPhone(normalizeOptional(request.phone()));
        visitor.setAccessToken(newToken());

        return toResponse(repository.save(visitor));
    }

    @Transactional
    public VisitorResponse login(VisitorLoginRequest request) {
        String email = normalizeEmail(request.email());
        // Mesma resposta para e-mail inexistente e senha errada, para nao revelar quem tem cadastro
        Visitor visitor = repository.findByEmailIgnoreCase(email)
                .filter((found) -> passwordMatches(request.password(), found.getPassword()))
                .orElseThrow(InvalidCredentialsException::new);

        if (visitor.getAccessToken() == null) {
            visitor.setAccessToken(newToken());
        }

        return toResponse(visitor);
    }

    private boolean passwordMatches(String rawPassword, String encodedPassword) {
        // Visitantes criados antes da senha existir ficam sem hash e nao conseguem entrar
        return encodedPassword != null
                && !encodedPassword.isBlank()
                && passwordEncoder.matches(rawPassword, encodedPassword);
    }

    private String newToken() {
        return UUID.randomUUID().toString();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private VisitorResponse toResponse(Visitor visitor) {
        return new VisitorResponse(
                visitor.getId(),
                visitor.getName(),
                visitor.getEmail(),
                visitor.getPhone(),
                visitor.getCreatedAt(),
                visitor.getAccessToken()
        );
    }
}

package com.wallace.store.service;

import com.wallace.store.dto.VisitorLoginRequest;
import com.wallace.store.dto.VisitorRequest;
import com.wallace.store.dto.VisitorResponse;
import com.wallace.store.exception.BusinessException;
import com.wallace.store.exception.VisitorNotFoundException;
import com.wallace.store.model.Visitor;
import com.wallace.store.repository.VisitorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitorService {
    private final VisitorRepository repository;

    public VisitorService(VisitorRepository repository) {
        this.repository = repository;
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
        visitor.setPhone(normalizeOptional(request.phone()));

        return toResponse(repository.save(visitor));
    }

    @Transactional(readOnly = true)
    public VisitorResponse login(VisitorLoginRequest request) {
        String email = normalizeEmail(request.email());

        return repository.findByEmailIgnoreCase(email)
                .map(this::toResponse)
                .orElseThrow(() -> new VisitorNotFoundException(email));
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
                visitor.getCreatedAt()
        );
    }
}

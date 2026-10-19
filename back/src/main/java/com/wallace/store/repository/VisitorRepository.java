package com.wallace.store.repository;

import com.wallace.store.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    Optional<Visitor> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}

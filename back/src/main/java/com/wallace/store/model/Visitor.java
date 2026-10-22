package com.wallace.store.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "tb_visitors")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "id")
public class Visitor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    // Hash BCrypt (60 caracteres), nunca a senha em texto puro
    @ToString.Exclude
    @Column(nullable = false, length = 60)
    private String password;

    @Column(length = 11)
    private String phone;

    // Token opaco usado pelo front no header X-Visitor-Token para identificar o visitante
    @ToString.Exclude
    @Column(unique = true, length = 36)
    private String accessToken;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

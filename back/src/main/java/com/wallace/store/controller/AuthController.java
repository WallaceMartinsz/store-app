package com.wallace.store.controller;

import com.wallace.store.dto.AdminLoginResponse;
import com.wallace.store.dto.VisitorLoginRequest;
import com.wallace.store.dto.VisitorRequest;
import com.wallace.store.dto.VisitorResponse;
import com.wallace.store.service.VisitorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final VisitorService visitorService;

    public AuthController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @GetMapping("/admin/me")
    public ResponseEntity<AdminLoginResponse> adminMe(Authentication authentication) {
        return ResponseEntity.ok(new AdminLoginResponse(authentication.getName(), "ADMIN"));
    }

    @PostMapping("/visitors")
    public ResponseEntity<VisitorResponse> registerVisitor(@RequestBody @Valid VisitorRequest request) {
        VisitorResponse visitor = visitorService.register(request);
        URI location = URI.create("/auth/visitors/" + visitor.id());

        return ResponseEntity.created(location).body(visitor);
    }

    @PostMapping("/visitors/login")
    public ResponseEntity<VisitorResponse> loginVisitor(@RequestBody @Valid VisitorLoginRequest request) {
        return ResponseEntity.ok(visitorService.login(request));
    }
}

package com.wallace.store.controller;

import com.wallace.store.dto.AdminLoginRequest;
import com.wallace.store.dto.AdminLoginResponse;
import com.wallace.store.dto.VisitorAuthResponse;
import com.wallace.store.dto.VisitorLoginRequest;
import com.wallace.store.dto.VisitorRequest;
import com.wallace.store.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AdminLoginResponse> loginAdmin(@RequestBody @Valid AdminLoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }

    @PostMapping("/visitors")
    public ResponseEntity<VisitorAuthResponse> registerVisitor(@RequestBody @Valid VisitorRequest request) {
        VisitorAuthResponse response = authService.registerVisitor(request);
        URI location = URI.create("/auth/visitors/" + response.visitor().id());

        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/visitors/login")
    public ResponseEntity<VisitorAuthResponse> loginVisitor(@RequestBody @Valid VisitorLoginRequest request) {
        return ResponseEntity.ok(authService.loginVisitor(request));
    }
}

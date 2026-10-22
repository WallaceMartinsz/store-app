package com.wallace.store.service;

import com.wallace.store.dto.AdminLoginRequest;
import com.wallace.store.dto.AdminLoginResponse;
import com.wallace.store.dto.VisitorAuthResponse;
import com.wallace.store.dto.VisitorLoginRequest;
import com.wallace.store.dto.VisitorRequest;
import com.wallace.store.dto.VisitorResponse;
import com.wallace.store.exception.InvalidCredentialsException;
import com.wallace.store.security.Roles;
import com.wallace.store.security.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final VisitorService visitorService;
    private final TokenService tokenService;

    public AuthService(
            AuthenticationManager authenticationManager,
            VisitorService visitorService,
            TokenService tokenService
    ) {
        this.authenticationManager = authenticationManager;
        this.visitorService = visitorService;
        this.tokenService = tokenService;
    }

    public AdminLoginResponse loginAdmin(AdminLoginRequest request) {
        Authentication authentication;

        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (AuthenticationException exception) {
            throw new InvalidCredentialsException("Usuario ou senha de admin invalidos.");
        }

        TokenService.IssuedToken token = tokenService.issue(authentication.getName(), Roles.ADMIN);
        return new AdminLoginResponse(token.token(), token.expiresAt(), authentication.getName(), Roles.ADMIN);
    }

    public VisitorAuthResponse registerVisitor(VisitorRequest request) {
        return withToken(visitorService.register(request));
    }

    public VisitorAuthResponse loginVisitor(VisitorLoginRequest request) {
        return withToken(visitorService.login(request));
    }

    private VisitorAuthResponse withToken(VisitorResponse visitor) {
        TokenService.IssuedToken token = tokenService.issue(visitor.id().toString(), Roles.VISITOR);
        return new VisitorAuthResponse(token.token(), token.expiresAt(), visitor);
    }
}

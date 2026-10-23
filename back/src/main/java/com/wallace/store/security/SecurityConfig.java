package com.wallace.store.security;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class SecurityConfig {
    // HS256 exige chave de pelo menos 256 bits
    private static final int MIN_SECRET_BYTES = 32;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf((csrf) -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/store/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/admin/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/visitors").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/visitors/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/store/**").hasRole(Roles.ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/store/**").hasRole(Roles.ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/store/**").hasRole(Roles.ADMIN)
                        // Visitante cria e ve so os proprios pedidos; admin ve todos e altera o status
                        .requestMatchers(HttpMethod.POST, "/orders").hasRole(Roles.VISITOR)
                        .requestMatchers(HttpMethod.GET, "/orders/me").hasRole(Roles.VISITOR)
                        .requestMatchers(HttpMethod.POST, "/orders/*/payment").hasRole(Roles.VISITOR)
                        .requestMatchers(HttpMethod.GET, "/orders").hasRole(Roles.ADMIN)
                        .requestMatchers(HttpMethod.GET, "/orders/*").hasAnyRole(Roles.ADMIN, Roles.VISITOR)
                        .requestMatchers(HttpMethod.PATCH, "/orders/*/status").hasRole(Roles.ADMIN)
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer((resourceServer) -> resourceServer
                        .jwt((jwt) -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )
                .build();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey()));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(jwtSecretKey())
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(TokenService.ISSUER));
        return decoder;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        return new InMemoryUserDetailsManager(
                User.withUsername(adminUsername)
                        .password(passwordEncoder.encode(adminPassword))
                        .roles(Roles.ADMIN)
                        .build()
        );
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Converte o claim "role" do token em ROLE_ADMIN / ROLE_VISITOR
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName(TokenService.ROLE_CLAIM);
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }

    private SecretKey jwtSecretKey() {
        byte[] secret = jwtSecret.getBytes(StandardCharsets.UTF_8);

        if (secret.length < MIN_SECRET_BYTES) {
            throw new IllegalStateException("app.jwt.secret deve ter pelo menos " + MIN_SECRET_BYTES + " caracteres.");
        }

        return new SecretKeySpec(secret, "HmacSHA256");
    }
}

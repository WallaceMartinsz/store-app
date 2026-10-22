package com.wallace.store.security;

import com.wallace.store.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, VisitorRepository visitorRepository) throws Exception {
        return http
                .csrf((csrf) -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/store/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/visitors").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/visitors/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/auth/admin/me").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/store/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/store/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/store/**").hasRole("ADMIN")
                        // Visitante cria e ve so os proprios pedidos; admin ve todos e altera o status
                        .requestMatchers(HttpMethod.POST, "/orders").hasRole(VisitorTokenFilter.ROLE)
                        .requestMatchers(HttpMethod.GET, "/orders/me").hasRole(VisitorTokenFilter.ROLE)
                        .requestMatchers(HttpMethod.GET, "/orders").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/orders/*").hasAnyRole("ADMIN", VisitorTokenFilter.ROLE)
                        .requestMatchers(HttpMethod.PATCH, "/orders/*/status").hasRole("ADMIN")
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new VisitorTokenFilter(visitorRepository), BasicAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        return new InMemoryUserDetailsManager(
                User.withUsername(adminUsername)
                        .password(passwordEncoder.encode(adminPassword))
                        .roles("ADMIN")
                        .build()
        );
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

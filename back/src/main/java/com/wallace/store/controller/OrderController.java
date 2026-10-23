package com.wallace.store.controller;

import com.wallace.store.dto.OrderRequest;
import com.wallace.store.dto.OrderResponse;
import com.wallace.store.dto.OrderStatusRequest;
import com.wallace.store.security.Roles;
import com.wallace.store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(@RequestParam(required = false) Long visitorId) {
        return ResponseEntity.ok(orderService.findAll(visitorId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.findByVisitor(visitorId(authentication)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID id, Authentication authentication) {
        Long ownerVisitorId = isVisitor(authentication) ? visitorId(authentication) : null;
        return ResponseEntity.ok(orderService.findById(id, ownerVisitorId));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody @Valid OrderRequest request,
            Authentication authentication
    ) {
        OrderResponse order = orderService.create(visitorId(authentication), request);
        URI location = URI.create("/orders/" + order.id());

        return ResponseEntity.created(location).body(order);
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<OrderResponse> payOrder(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(orderService.pay(id, visitorId(authentication)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody @Valid OrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    private boolean isVisitor(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch((authority) -> authority.getAuthority().equals("ROLE_" + Roles.VISITOR));
    }

    private Long visitorId(Authentication authentication) {
        // O "sub" do JWT do visitante e o id dele
        return Long.valueOf(authentication.getName());
    }
}

package com.wallace.store.service;

import com.wallace.store.dto.OrderItemRequest;
import com.wallace.store.dto.OrderItemResponse;
import com.wallace.store.dto.OrderRequest;
import com.wallace.store.dto.OrderResponse;
import com.wallace.store.dto.OrderStatusRequest;
import com.wallace.store.exception.BusinessException;
import com.wallace.store.exception.OrderNotFoundException;
import com.wallace.store.exception.ProductNotFoundException;
import com.wallace.store.exception.VisitorNotFoundException;
import com.wallace.store.model.*;
import com.wallace.store.repository.OrderRepository;
import com.wallace.store.repository.ProductRepository;
import com.wallace.store.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "createdAt");

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS = Map.of(
            OrderStatus.PENDENTE, Set.of(OrderStatus.PAGO, OrderStatus.CANCELADO),
            OrderStatus.PAGO, Set.of(OrderStatus.ENVIADO, OrderStatus.CANCELADO),
            OrderStatus.ENVIADO, Set.of(),
            OrderStatus.CANCELADO, Set.of()
    );

    private final OrderRepository repository;
    private final VisitorRepository visitorRepository;
    private final ProductRepository productRepository;
    private final BigDecimal shippingFee;

    public OrderService(
            OrderRepository repository,
            VisitorRepository visitorRepository,
            ProductRepository productRepository,
            @Value("${app.order.shipping-fee}") BigDecimal shippingFee
    ) {
        this.repository = repository;
        this.visitorRepository = visitorRepository;
        this.productRepository = productRepository;
        this.shippingFee = shippingFee;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll(Long visitorId) {
        if (visitorId != null) {
            return findByVisitor(visitorId);
        }

        return repository.findAll(NEWEST_FIRST)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findByVisitor(Long visitorId) {
        if (!visitorRepository.existsById(visitorId)) {
            throw new VisitorNotFoundException(visitorId);
        }

        return repository.findByVisitorId(visitorId, NEWEST_FIRST)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ownerVisitorId preenchido limita a busca aos pedidos do visitante logado
    @Transactional(readOnly = true)
    public OrderResponse findById(UUID id, Long ownerVisitorId) {
        return toResponse(findOrder(id, ownerVisitorId));
    }

    @Transactional
    public OrderResponse create(Long visitorId, OrderRequest request) {
        Visitor visitor = visitorRepository.findById(visitorId)
                .orElseThrow(() -> new VisitorNotFoundException(visitorId));

        Map<Long, Integer> quantities = request.items().stream()
                .collect(Collectors.toMap(OrderItemRequest::productId, OrderItemRequest::quantity, Integer::sum));

        Order order = new Order();
        order.setVisitor(visitor);
        order.setStatus(OrderStatus.PENDENTE);
        order.setPaymentMethod(request.paymentMethod());
        order.setInstallments(installmentsFor(request));

        BigDecimal subtotal = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : quantities.entrySet()) {
            Product product = productRepository.findById(entry.getKey())
                    .orElseThrow(() -> new ProductNotFoundException(entry.getKey()));
            int quantity = entry.getValue();

            if (product.getQuantity() < quantity) {
                throw new BusinessException("Estoque insuficiente para " + product.getName() + ".");
            }
            product.setQuantity(product.getQuantity() - quantity);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setUnitPrice(product.getPrice());
            order.getItems().add(item);

            subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }

        order.setShipping(shippingFee);
        order.setTotal(subtotal.add(shippingFee));

        return toResponse(repository.save(order));
    }

    @Transactional
    public OrderResponse updateStatus(UUID id, OrderStatusRequest request) {
        Order order = findOrder(id);
        changeStatus(order, request.status());
        return toResponse(order);
    }

    /**
     * Pagamento simulado pelo proprio visitante: nao ha gateway, a confirmacao
     * so leva o pedido pendente para PAGO, com as mesmas regras do admin.
     */
    @Transactional
    public OrderResponse pay(UUID id, Long visitorId) {
        Order order = findOrder(id, visitorId);
        changeStatus(order, OrderStatus.PAGO);
        return toResponse(order);
    }

    private void changeStatus(Order order, OrderStatus newStatus) {
        if (!ALLOWED_TRANSITIONS.get(order.getStatus()).contains(newStatus)) {
            throw new BusinessException(
                    "Nao e possivel alterar o pedido de " + order.getStatus() + " para " + newStatus + "."
            );
        }

        LocalDateTime now = LocalDateTime.now();
        switch (newStatus) {
            case PAGO -> order.setPaidAt(now);
            case ENVIADO -> order.setShippedAt(now);
            case CANCELADO -> {
                order.setCanceledAt(now);
                restoreStock(order);
            }
            default -> {
            }
        }

        order.setStatus(newStatus);
    }

    private Integer installmentsFor(OrderRequest request) {
        if (request.paymentMethod() != PaymentMethod.CARTAO) {
            return null;
        }

        return request.installments() == null ? 1 : request.installments();
    }

    private Order findOrder(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    /**
     * Quando {@code ownerVisitorId} e informado (visitante logado), so retorna se o pedido for dele;
     * pedido de outro cliente responde 404 para nao expor que existe.
     */
    private Order findOrder(UUID id, Long ownerVisitorId) {
        Order order = findOrder(id);

        if (ownerVisitorId != null && !order.getVisitor().getId().equals(ownerVisitorId)) {
            throw new OrderNotFoundException(id);
        }

        return order;
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
        }
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getVisitor().getId(),
                order.getVisitor().getName(),
                order.getVisitor().getEmail(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getInstallments(),
                order.getItems().stream().map(this::toItemResponse).toList(),
                order.getShipping(),
                order.getTotal(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getPaidAt(),
                order.getShippedAt(),
                order.getCanceledAt()
        );
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        Product product = item.getProduct();

        return new OrderItemResponse(
                product.getId(),
                product.getName(),
                product.getImg(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}

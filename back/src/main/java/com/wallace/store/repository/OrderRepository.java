package com.wallace.store.repository;

import com.wallace.store.model.Order;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByVisitorId(Long visitorId, Sort sort);

    @Override
    @EntityGraph(attributePaths = {"visitor", "items", "items.product"})
    List<Order> findAll(Sort sort);
}

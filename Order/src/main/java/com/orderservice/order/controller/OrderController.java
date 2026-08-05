package com.orderservice.order.controller;

import com.orderservice.order.dto.OrderRequest;
import com.orderservice.order.entity.Order;
import com.orderservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public Order createOrder(
            @RequestBody OrderRequest request,
            @RequestHeader("X-Username")
            String username) {

        return service.createOrder(
                request,
                username
        );
    }

    @GetMapping
    public List<Order> getOrders(
            @RequestHeader("X-Username")
            String username) {

        return service.getUserOrders(
                username
        );
    }

    @GetMapping("/user/{username}")
    public List<Order> getOrdersByUser(
            @PathVariable String username) {

        return service.getUserOrders(
                username);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalOrders() {

        return ResponseEntity.ok(
                service.getTotalOrders()
        );

    }

    @GetMapping("/pending/count")
    public ResponseEntity<Long> getPendingOrders() {

        return ResponseEntity.ok(
                service.getPendingOrders()
        );

    }
}
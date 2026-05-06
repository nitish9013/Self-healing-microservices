package com.orderservice.order.controller;

import com.orderservice.order.dto.OrderRequest;
import com.orderservice.order.entity.Order;
import com.orderservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request,
                             Authentication auth) {
        return service.createOrder(request, auth.getName());
    }

    @GetMapping
    public List<Order> getOrders(Authentication auth) {
        return service.getUserOrders(auth.getName());
    }
}
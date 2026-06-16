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

        String username =
                auth != null
                        ? auth.getName()
                        : "nitish@gmail.com";
        return service.createOrder(request, username);
    }

    @GetMapping
    public List<Order> getOrders(Authentication auth) {
        return service.getUserOrders(auth.getName());
    }

    @GetMapping("/user/{username}")
    public List<Order> getOrdersByUser(
            @PathVariable String username) {

        return service.getUserOrders(
                username);
    }
}
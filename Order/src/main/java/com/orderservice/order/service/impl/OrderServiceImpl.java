package com.orderservice.order.service.impl;

import com.orderservice.order.dto.OrderRequest;
import com.orderservice.order.entity.Order;
import com.orderservice.order.repository.OrderRepository;
import com.orderservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repo;

    @Override
    public Order createOrder(OrderRequest request, String username) {

        Order order = Order.builder()
                .productName(request.getProductName())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .username(username)
                .status("CREATED")
                .build();

        Order saved = repo.save(order);

        // 🔥 FUTURE: publish event to Kafka
        // kafkaTemplate.send("order-created", saved);

        return saved;
    }

    @Override
    public List<Order> getUserOrders(String username) {
        return repo.findByUsername(username);
    }
}
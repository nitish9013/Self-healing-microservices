package com.orderservice.order.service.impl;

import com.orderservice.order.dto.OrderRequest;
import com.orderservice.order.dto.ProductResponse;
import com.orderservice.order.entity.Order;
import com.orderservice.order.feign.CatalogFeignClient;
import com.orderservice.order.repository.OrderRepository;
import com.orderservice.order.service.OrderEventProducer;
import com.orderservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.orderservice.order.event.OrderCreatedEvent;
import com.orderservice.order.service.OrderEventProducer;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repo;
    private final CatalogFeignClient catalogFeignClient;
    private final OrderEventProducer orderEventProducer;

    @Override
    public Order createOrder(OrderRequest request, String username) {

        ProductResponse product =
                catalogFeignClient.getProduct(request.getProductId());

        Order order = Order.builder()
                .productName(product.getName())
                .price(product.getPrice().doubleValue())
                .quantity(request.getQuantity())
                .username(username)
                .status("CREATED")
                .build();

        Order saved = repo.save(order);

        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(saved.getId())
                .productName(saved.getProductName())
                .quantity(saved.getQuantity())
                .price(saved.getPrice())
                .username(saved.getUsername())
                .status(saved.getStatus())
                .build();

        orderEventProducer.publishOrderCreated(event);

        return saved;
    }

    @Override
    public List<Order> getUserOrders(String username) {
        return repo.findByUsername(username);
    }

    @Override
    public Long getTotalOrders() {
        return repo.count();
    }

    @Override
    public Long getPendingOrders() {
        return repo.countByStatus("PENDING");
    }
}
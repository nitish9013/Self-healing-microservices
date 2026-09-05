package com.orderservice.order.service.impl;

import com.orderservice.order.dto.OrderRequest;
import com.orderservice.order.dto.ProductResponse;
import com.orderservice.order.entity.Order;
import com.orderservice.order.event.OrderCreatedEvent;
import com.orderservice.order.feign.CatalogFeignClient;
import com.orderservice.order.repository.OrderRepository;
import com.orderservice.order.service.CatalogServiceClient;
import com.orderservice.order.service.OrderEventProducer;
import com.orderservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repo;
    private final CatalogServiceClient catalogServiceClient;
    private final OrderEventProducer orderEventProducer;

    @Override
    public Order createOrder(OrderRequest request, String username) {

        /*
         * Step 1:
         * Fetch product from Catalog Service.
         *
         * This ensures that the product actually exists
         * before creating the order.
         */
        ProductResponse product =
                catalogServiceClient.getProduct(request.getProductId());


        /*
         * Step 2:
         * Create order using a snapshot of the product data.
         *
         * We store productId because Catalog is a separate
         * microservice and we should not create a JPA
         * relationship with its Product entity.
         */
        Order order = Order.builder()
                .productId(request.getProductId())
                .productName(product.getName())
                .price(product.getPrice().doubleValue())
                .quantity(request.getQuantity())
                .username(username)
                .status("PENDING")
                .build();


        /*
         * Step 3:
         * Persist order.
         */
        Order saved = repo.save(order);


        /*
         * Step 4:
         * Publish OrderCreatedEvent.
         *
         * Payment Service can consume this event
         * asynchronously through Kafka.
         */
        OrderCreatedEvent event =
                OrderCreatedEvent.builder()
                        .orderId(saved.getId())
                        .username(saved.getUsername())
                        .productId(saved.getProductId())
                        .productName(saved.getProductName())
                        .quantity(saved.getQuantity())
                        .price(saved.getPrice())
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
    public Order getOrderById(Long orderId) {

        return repo.findById(orderId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Order not found"
                        )
                );
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
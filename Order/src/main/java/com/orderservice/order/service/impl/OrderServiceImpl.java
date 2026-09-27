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
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repo;
    private final CatalogServiceClient catalogServiceClient;
    private final OrderEventProducer orderEventProducer;
    private final CatalogFeignClient catalogFeignClient;

    @Override
    public Order createOrder(
            OrderRequest request,
            String username) {

        log.info(
                "Order creation started username={} productId={} quantity={}",
                username,
                request.getProductId(),
                request.getQuantity()
        );

        try {

            ProductResponse product =
                    catalogFeignClient.getProduct(
                            request.getProductId()
                    );

            log.info(
                    "Product validated productId={} productName={}",
                    request.getProductId(),
                    product.getName()
            );

            Order order = Order.builder()
                    .productName(product.getName())
                    .price(product.getPrice().doubleValue())
                    .quantity(request.getQuantity())
                    .username(username)
                    .status("CREATED")
                    .build();

            Order saved = repo.save(order);

            log.info(
                    "Order created orderId={} username={}",
                    saved.getId(),
                    username
            );

            OrderCreatedEvent event =
                    OrderCreatedEvent.builder()
                            .orderId(saved.getId())
                            .productName(saved.getProductName())
                            .quantity(saved.getQuantity())
                            .price(saved.getPrice())
                            .username(saved.getUsername())
                            .status(saved.getStatus())
                            .build();

            orderEventProducer.publishOrderCreated(event);

            log.info(
                    "OrderCreatedEvent published orderId={}",
                    saved.getId()
            );

            return saved;

        } catch (Exception e) {

            log.error(
                    "Order creation failed username={} productId={}",
                    username,
                    request.getProductId(),
                    e
            );

            throw e;
        }
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
    @Override
    public List<Order> getAllOrders() {
        return repo.findAll();
    }
}
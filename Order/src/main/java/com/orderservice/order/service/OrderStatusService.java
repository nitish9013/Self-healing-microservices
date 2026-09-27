package com.orderservice.order.service;

import com.orderservice.order.entity.Order;
import com.orderservice.order.event.PaymentCompletedEvent;
import com.orderservice.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderRepository orderRepository;

    public void updateOrderStatus(PaymentCompletedEvent event) {

        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("SUCCESS".equalsIgnoreCase(event.getPaymentStatus())) {

            order.setStatus("PAID");

        } else {

            order.setStatus("FAILED");

        }

        orderRepository.save(order);

        log.info(
                "Order status updated orderId={} status={}",
                order.getId(),
                order.getStatus()
        );

    }
}
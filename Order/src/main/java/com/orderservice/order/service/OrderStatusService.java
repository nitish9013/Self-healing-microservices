package com.orderservice.order.service;

import com.orderservice.order.entity.Order;
import com.orderservice.order.event.PaymentCompletedEvent;
import com.orderservice.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        System.out.println("Order Status Updated : " + order.getStatus());

    }
}
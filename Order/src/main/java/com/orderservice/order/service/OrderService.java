package com.orderservice.order.service;

import com.orderservice.order.dto.OrderRequest;
import com.orderservice.order.entity.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequest request, String username);
    List<Order> getUserOrders(String username);
}
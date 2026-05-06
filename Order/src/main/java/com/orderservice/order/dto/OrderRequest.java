package com.orderservice.order.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String productName;
    private int quantity;
    private double price;
}
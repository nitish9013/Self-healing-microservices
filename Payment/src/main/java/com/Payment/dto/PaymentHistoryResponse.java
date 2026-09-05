package com.Payment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentHistoryResponse {

    private String provider;
    private String paymentId;

    private String orderId;

    private Double amount;

    private String currency;

    private String transactionId;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;
}
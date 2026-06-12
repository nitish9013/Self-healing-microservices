package com.Payment.dto;

import lombok.Data;

@Data
public class RefundRequest {

    private String paymentId;

    private Double amount;
}
package com.Payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponse {

    private String paymentId;

    private String orderId;

    private String razorpayOrderId;

    private String status;

    private String message;
}
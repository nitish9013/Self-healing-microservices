package com.Payment.dto;

import lombok.Data;

@Data
public class RazorpayWebhookRequest {

    private String event;

    private String paymentId;

    private String orderId;

    private String status;
}
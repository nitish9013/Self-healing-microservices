package com.Payment.dto;

import lombok.Data;

@Data
public class VerifyPaymentRequest {

    private String paymentId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}
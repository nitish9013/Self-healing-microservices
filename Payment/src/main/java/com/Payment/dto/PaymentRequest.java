
package com.Payment.dto;

import lombok.Data;



import lombok.Data;

@Data
public class PaymentRequest {

    private String orderId;

    private String userId;

    private Double amount;

    private String currency;

    private String idempotencyKey;
}
package com.Payment.event;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCompletedEvent {

    private Long orderId;

    private UUID paymentId;

    private String paymentStatus;

    private String transactionId;

    private LocalDateTime paidAt;
}
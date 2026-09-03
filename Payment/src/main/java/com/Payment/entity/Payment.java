package com.Payment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "payments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_payment_order_id",
                        columnNames = "orderId"
                ),
                @UniqueConstraint(
                        name = "uk_payment_idempotency_key",
                        columnNames = "idempotencyKey"
                ),
                @UniqueConstraint(
                        name = "uk_payment_razorpay_payment_id",
                        columnNames = "razorpayPaymentId"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String orderId;

    private String userId;

    private Double amount;

    private String currency;

    private String transactionId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    @Column(nullable = false, length = 100)
    private String idempotencyKey;

    private String provider;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private Integer retryCount;

    private String failureReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;
}
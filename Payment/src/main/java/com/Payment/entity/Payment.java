package com.Payment.entity;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

// ================================
// PAYMENT SERVICE - SPRING BOOT
// ================================

// Tech Stack:
// Spring Boot
// Spring Security JWT
// PostgreSQL
// OpenFeign
// Razorpay
// JPA/Hibernate

// =======================================
// 1. Payment Entity
// =======================================



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
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

    private String transactionId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String provider;

    private PaymentStatus status;

    private Integer retryCount;

    private String failureReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;
}
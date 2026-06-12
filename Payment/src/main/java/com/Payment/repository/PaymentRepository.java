package com.Payment.repository;

import com.Payment.entity.Payment;
import com.Payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository
        extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(String orderId);

    Optional<Payment> findByTransactionId(
            String transactionId
    );

    List<Payment> findByStatus(
            PaymentStatus status
    );

    List<Payment> findByUserId(
            String userId
    );
}
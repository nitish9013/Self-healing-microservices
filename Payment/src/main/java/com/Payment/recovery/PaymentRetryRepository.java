package com.Payment.recovery;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentRetryRepository
        extends JpaRepository<PaymentRetry, UUID> {
}
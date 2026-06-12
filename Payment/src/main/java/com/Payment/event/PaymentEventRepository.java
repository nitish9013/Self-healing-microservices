package com.Payment.event;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentEventRepository
        extends JpaRepository<PaymentEvent, UUID> {
}
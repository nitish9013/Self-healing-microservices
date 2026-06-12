package com.Payment.event;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentEventService {

    private final com.Payment.event.PaymentEventRepository repository;

    public void saveEvent(
            UUID paymentId,
            String eventType,
            String payload
    ) {

        PaymentEvent event =
                PaymentEvent.builder()
                        .paymentId(paymentId)
                        .eventType(eventType)
                        .payload(payload)
                        .createdAt(LocalDateTime.now())
                        .build();

        repository.save(event);
    }
}
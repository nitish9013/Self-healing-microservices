package com.Payment.kafka;

import com.Payment.service.PaymentProcessorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Payment.event.OrderCreatedEvent;
import com.Payment.event.PaymentEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderEventConsumer {
    private final PaymentProcessorService paymentProcessorService;
    private final PaymentEventService paymentEventService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "order-created-topic",
            groupId = "payment-group"
    )
    public void consume(OrderCreatedEvent event) {

        System.out.println("Received Order Event : " + event);

        try {

            paymentEventService.saveEvent(
                    UUID.randomUUID(),
                    "ORDER_CREATED",
                    objectMapper.writeValueAsString(event)
            );
            paymentProcessorService.processPayment(event);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
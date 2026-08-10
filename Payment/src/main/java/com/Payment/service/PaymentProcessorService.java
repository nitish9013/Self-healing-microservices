package com.Payment.service;

import com.Payment.event.OrderCreatedEvent;
import com.Payment.event.PaymentCompletedEvent;
import com.Payment.kafka.PaymentEventProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
@RequiredArgsConstructor

public class PaymentProcessorService {

    private final PaymentEventProducer producer;


    @Retry(name = "paymentRetry")
    @CircuitBreaker(
            name = "paymentCircuitBreaker",
            fallbackMethod = "paymentFallback"
    )
    public void processPayment(OrderCreatedEvent event) {
        System.out.println("Processing Payment...");

        try {
            Thread.sleep(2000);   // simulate payment processing
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

//        boolean success = new Random().nextInt(100) < 80;
        boolean success= false;
        if (!success) {
            System.out.println("Payment Failed...");

            throw new RuntimeException("Payment Gateway Timeout");
        }

        System.out.println("Payment Success...");
        PaymentCompletedEvent completedEvent =
                PaymentCompletedEvent.builder()
                        .orderId(event.getOrderId())
                        .paymentId(UUID.randomUUID())
                        .paymentStatus(success ? "SUCCESS" : "FAILED")
                        .transactionId(UUID.randomUUID().toString())
                        .paidAt(LocalDateTime.now())
                        .build();

        producer.publishPaymentCompleted(completedEvent);
    }

    public void paymentFallback(
            OrderCreatedEvent event,
            Exception ex
    ) {

        System.out.println(
                "Fallback Executed : "
                        + ex.getMessage()
        );
        producer.publishToDLQ(event);

    }
}
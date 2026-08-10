package com.Payment.kafka;

import com.Payment.event.OrderCreatedEvent;
import com.Payment.event.PaymentCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        kafkaTemplate.send(KafkaTopics.PAYMENT_COMPLETED_TOPIC, event);
        System.out.println("Payment Event Published : " + event);
    }

    public void publishToDLQ(OrderCreatedEvent event) {
        kafkaTemplate.send(KafkaTopics.PAYMENT_DLQ_TOPIC, event);
        System.out.println("DLQ Event Published : " + event);
    }
}
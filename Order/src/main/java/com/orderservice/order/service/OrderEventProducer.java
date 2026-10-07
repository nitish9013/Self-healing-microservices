package com.orderservice.order.service;

import com.orderservice.order.event.OrderCreatedEvent;
import com.orderservice.order.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    public void publishOrderCreated(OrderCreatedEvent event) {
        String partitionKey = String.valueOf(event.getOrderId());

        log.info("Publishing OrderCreatedEvent: orderId={}, topic={}, key={}",
                event.getOrderId(), KafkaTopics.ORDER_CREATED_TOPIC, partitionKey);

        try {
            // Send with partition key to guarantee ordered processing per orderId
            kafkaTemplate.send(
                    KafkaTopics.ORDER_CREATED_TOPIC,
                    partitionKey,
                    event
            ).whenComplete((result, exception) -> {
                if (exception != null) {
                    log.error("[RESILIENCE-ALERT] Failed to publish OrderCreatedEvent to Kafka: orderId={}, reason={}",
                            event.getOrderId(), exception.getMessage(), exception);
                    return;
                }

                log.info("OrderCreatedEvent published successfully: orderId={}, offset={}",
                        event.getOrderId(),
                        result != null && result.getRecordMetadata() != null ? result.getRecordMetadata().offset() : "N/A");
            });
        } catch (Exception ex) {
            log.error("[RESILIENCE-ALERT] Kafka producer synchronous failure during send for orderId={}: {}",
                    event.getOrderId(), ex.getMessage(), ex);
        }
    }
}
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

        log.info(
                "Publishing OrderCreatedEvent orderId={}",
                event.getOrderId()
        );

        kafkaTemplate.send(
                KafkaTopics.ORDER_CREATED_TOPIC,
                event
        ).whenComplete((result, exception) -> {

            if (exception != null) {

                log.error(
                        "Failed to publish OrderCreatedEvent orderId={}",
                        event.getOrderId(),
                        exception
                );

                return;
            }

            log.info(
                    "OrderCreatedEvent published successfully orderId={} topic={}",
                    event.getOrderId(),
                    KafkaTopics.ORDER_CREATED_TOPIC
            );
        });
    }
}
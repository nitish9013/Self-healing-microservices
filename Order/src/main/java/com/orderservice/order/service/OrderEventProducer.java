package com.orderservice.order.service;

import com.orderservice.order.event.OrderCreatedEvent;
import com.orderservice.order.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    public void publishOrderCreated(OrderCreatedEvent event) {

        kafkaTemplate.send(KafkaTopics.ORDER_CREATED_TOPIC, event);
        System.out.println("Order Event Published : " + event);
    }
}
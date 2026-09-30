package com.orderservice.order.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.stereotype.Component;

@Component
public class KafkaStartupConfig {

    private final KafkaListenerEndpointRegistry kafkaListenerEndpointRegistry;

    @Value("${KAFKA_ENABLED:false}")
    private boolean kafkaEnabled;

    public KafkaStartupConfig(
            KafkaListenerEndpointRegistry kafkaListenerEndpointRegistry) {
        this.kafkaListenerEndpointRegistry = kafkaListenerEndpointRegistry;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void startKafkaListeners() {

        if (!kafkaEnabled) {
            System.out.println("Kafka listeners are disabled.");
            return;
        }

        System.out.println("Starting Kafka listeners after application startup...");

        kafkaListenerEndpointRegistry.start();
    }
}
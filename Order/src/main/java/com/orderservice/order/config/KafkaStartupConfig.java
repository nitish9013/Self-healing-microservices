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

        Thread kafkaStartupThread = new Thread(() -> {
            try {
                System.out.println("Starting Kafka listeners asynchronously...");

                kafkaListenerEndpointRegistry.start();

                System.out.println("Kafka listeners started successfully.");

            } catch (Exception e) {
                System.err.println(
                        "Kafka listener startup failed: " + e.getMessage()
                );
                e.printStackTrace();
            }
        });

        kafkaStartupThread.setName("kafka-listener-startup");
        kafkaStartupThread.setDaemon(true);
        kafkaStartupThread.start();
    }
}
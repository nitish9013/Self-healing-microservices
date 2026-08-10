package com.Payment.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic paymentCompletedTopic() {
        return new NewTopic(
                KafkaTopics.PAYMENT_COMPLETED_TOPIC,
                1,
                (short) 1
        );
    }

    @Bean
    public NewTopic paymentDLQTopic() {
        return new NewTopic(
                KafkaTopics.PAYMENT_DLQ_TOPIC,
                1,
                (short) 1
        );
    }
}
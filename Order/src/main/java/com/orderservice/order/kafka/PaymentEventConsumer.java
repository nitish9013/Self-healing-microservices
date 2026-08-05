package com.orderservice.order.kafka;

import com.orderservice.order.event.PaymentCompletedEvent;
import com.orderservice.order.service.OrderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final OrderStatusService orderStatusService;

    @KafkaListener(
            topics = "payment-completed-topic",
            groupId = "order-group"
    )
    public void consume(PaymentCompletedEvent event) {

        System.out.println("Received Payment Event : " + event);

        orderStatusService.updateOrderStatus(event);

    }

}
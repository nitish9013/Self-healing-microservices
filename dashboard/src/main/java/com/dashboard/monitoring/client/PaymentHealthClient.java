package com.dashboard.monitoring.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "payment-health",
        url = "${payment.actuator.url}"
)
public interface PaymentHealthClient {

    @GetMapping("/actuator/health")
    ActuatorHealthResponse health();

}
package com.dashboard.monitoring.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "order-health",
        url = "${order.actuator.url}"
)
public interface OrderHealthClient {

    @GetMapping("/actuator/health")
    ActuatorHealthResponse health();

}
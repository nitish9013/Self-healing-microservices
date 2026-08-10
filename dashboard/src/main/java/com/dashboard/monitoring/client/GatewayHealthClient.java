package com.dashboard.monitoring.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "gateway-health",
        url = "${gateway.actuator.url}"
)
public interface GatewayHealthClient {

    @GetMapping("/actuator/health")
    ActuatorHealthResponse health();

}
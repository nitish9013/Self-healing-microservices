package com.dashboard.monitoring.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "auth-health",
        url = "${auth.actuator.url}"
)
public interface AuthHealthClient {

    @GetMapping("/actuator/health")
    ActuatorHealthResponse health();

}
package com.dashboard.monitoring.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "user-health",
        url = "${user.actuator.url}"
)
public interface UserHealthClient {

    @GetMapping("/actuator/health")
    ActuatorHealthResponse health();

}
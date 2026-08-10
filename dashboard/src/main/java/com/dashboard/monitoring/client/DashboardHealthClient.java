package com.dashboard.monitoring.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "dashboard-health",
        url = "${dashboard.actuator.url}"
)
public interface DashboardHealthClient {

    @GetMapping("/actuator/health")
    ActuatorHealthResponse health();

}
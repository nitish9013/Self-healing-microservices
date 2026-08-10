package com.dashboard.monitoring.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "catalog-health",
        url = "${catalog.actuator.url}"
)
public interface CatalogHealthClient {

    @GetMapping("/actuator/health")
    ActuatorHealthResponse health();

}
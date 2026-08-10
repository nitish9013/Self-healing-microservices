package com.dashboard.monitoring.controller;

import com.dashboard.monitoring.dto.CircuitBreakerResponse;
import com.dashboard.monitoring.service.CircuitBreakerMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/circuit-breaker")
@RequiredArgsConstructor
public class CircuitBreakerMonitoringController {

    private final CircuitBreakerMonitoringService service;

    @GetMapping
    public CircuitBreakerResponse status() {

        return service.getCircuitBreakerStatus();

    }

}
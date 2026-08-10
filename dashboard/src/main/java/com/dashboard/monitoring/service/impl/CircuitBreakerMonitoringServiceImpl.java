package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.dto.CircuitBreakerResponse;
import com.dashboard.monitoring.service.CircuitBreakerMonitoringService;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CircuitBreakerMonitoringServiceImpl
        implements CircuitBreakerMonitoringService {

    private final CircuitBreakerRegistry registry;

    @Override
    public CircuitBreakerResponse getCircuitBreakerStatus() {

        CircuitBreaker cb =
                registry.circuitBreaker("dashboardService");

        return CircuitBreakerResponse.builder()
                .name(cb.getName())
                .state(cb.getState().name())
                .build();

    }

}
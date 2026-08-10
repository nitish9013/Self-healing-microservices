package com.dashboard.monitoring.service;

import com.dashboard.monitoring.dto.CircuitBreakerResponse;

public interface CircuitBreakerMonitoringService {
    CircuitBreakerResponse getCircuitBreakerStatus();
}

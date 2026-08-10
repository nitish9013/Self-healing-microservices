package com.dashboard.monitoring.service;

import com.dashboard.monitoring.dto.ServiceHealthResponse;

import java.util.List;

public interface HealthMonitoringService {

    List<ServiceHealthResponse> getAllServicesHealth();

}
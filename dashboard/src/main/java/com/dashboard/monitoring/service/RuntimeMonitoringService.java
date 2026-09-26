package com.dashboard.monitoring.service;

import com.dashboard.monitoring.dto.ServiceRuntimeResponse;

import java.util.List;

public interface RuntimeMonitoringService {

    List<ServiceRuntimeResponse> getAllServicesRuntime();
}
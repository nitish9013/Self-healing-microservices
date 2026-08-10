package com.dashboard.monitoring.controller;

import com.dashboard.monitoring.dto.ServiceHealthResponse;
import com.dashboard.monitoring.service.HealthMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/services")
@RequiredArgsConstructor
public class HealthMonitoringController {

    private final HealthMonitoringService service;

    @GetMapping
    public List<ServiceHealthResponse> health() {

        return service.getAllServicesHealth();

    }

}
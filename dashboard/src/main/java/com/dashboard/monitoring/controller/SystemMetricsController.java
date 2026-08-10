package com.dashboard.monitoring.controller;

import com.dashboard.monitoring.dto.SystemMetricsResponse;
import com.dashboard.monitoring.service.SystemMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/system")
@RequiredArgsConstructor
public class SystemMetricsController {

    private final SystemMetricsService service;

    @GetMapping("/metrics")
    public SystemMetricsResponse metrics() {

        return service.getSystemMetrics();

    }

}
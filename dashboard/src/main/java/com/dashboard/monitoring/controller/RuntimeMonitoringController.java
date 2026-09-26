package com.dashboard.monitoring.controller;

import com.dashboard.monitoring.dto.ServiceRuntimeResponse;
import com.dashboard.monitoring.service.RuntimeMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/services")
@RequiredArgsConstructor
public class RuntimeMonitoringController {

    private final RuntimeMonitoringService runtimeMonitoringService;

    @GetMapping("/runtime")
    public List<ServiceRuntimeResponse> runtime() {
        return runtimeMonitoringService.getAllServicesRuntime();
    }
}
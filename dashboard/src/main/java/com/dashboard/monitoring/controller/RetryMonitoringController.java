package com.dashboard.monitoring.controller;

import com.dashboard.monitoring.dto.RetryMonitoringResponse;
import com.dashboard.monitoring.service.RetryMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/retries")
@RequiredArgsConstructor
public class RetryMonitoringController {

    private final RetryMonitoringService service;

    @GetMapping
    public RetryMonitoringResponse retries() {

        return service.getRetryStats();

    }

}
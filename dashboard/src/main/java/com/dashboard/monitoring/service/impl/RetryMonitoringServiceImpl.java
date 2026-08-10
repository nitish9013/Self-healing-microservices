package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.dto.RetryMonitoringResponse;
import com.dashboard.monitoring.retry.RetryMetrics;
import com.dashboard.monitoring.service.RetryMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RetryMonitoringServiceImpl
        implements RetryMonitoringService {

    private final RetryMetrics retryMetrics;

    @Override
    public RetryMonitoringResponse getRetryStats() {

        return RetryMonitoringResponse.builder()
                .totalRetries(
                        retryMetrics.getTotalRetries()
                )
                .successfulRetries(
                        retryMetrics.getSuccessfulRetries()
                )
                .failedRetries(
                        retryMetrics.getFailedRetries()
                )
                .build();

    }

}
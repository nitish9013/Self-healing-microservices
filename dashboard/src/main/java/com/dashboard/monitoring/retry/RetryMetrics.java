package com.dashboard.monitoring.retry;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RetryMetrics {

    private final AtomicInteger totalRetries = new AtomicInteger();

    private final AtomicInteger successfulRetries = new AtomicInteger();

    private final AtomicInteger failedRetries = new AtomicInteger();

    public void incrementRetry() {
        totalRetries.incrementAndGet();
    }

    public void incrementSuccess() {
        successfulRetries.incrementAndGet();
    }

    public void incrementFailure() {
        failedRetries.incrementAndGet();
    }

    public int getTotalRetries() {
        return totalRetries.get();
    }

    public int getSuccessfulRetries() {
        return successfulRetries.get();
    }

    public int getFailedRetries() {
        return failedRetries.get();
    }

}
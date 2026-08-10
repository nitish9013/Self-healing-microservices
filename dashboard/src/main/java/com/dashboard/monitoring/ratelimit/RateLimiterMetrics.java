package com.dashboard.monitoring.ratelimit;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class RateLimiterMetrics {

    private final AtomicLong blockedRequests =
            new AtomicLong();

    public void incrementBlockedRequests() {

        blockedRequests.incrementAndGet();

    }

    public long getBlockedRequests() {

        return blockedRequests.get();

    }

}
package com.dashboard.monitoring.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateLimiterResponse {

    private long capacity;

    private long availableTokens;

    private long blockedRequests;

}
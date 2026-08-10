package com.dashboard.monitoring.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetryMonitoringResponse {

    private int totalRetries;

    private int successfulRetries;

    private int failedRetries;

}
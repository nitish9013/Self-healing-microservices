package com.dashboard.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRuntimeResponse {

    private String serviceName;

    private Double cpuUsage;

    private Long memoryUsed;

    private Long memoryMax;

    private Integer threads;

    private Double uptimeSeconds;
}
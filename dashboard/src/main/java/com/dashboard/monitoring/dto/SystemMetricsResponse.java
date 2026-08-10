package com.dashboard.monitoring.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemMetricsResponse {

    private double cpuUsage;

    private double memoryUsage;

    private long heapUsed;

    private long heapMax;

    private int threadCount;

    private String uptime;

}
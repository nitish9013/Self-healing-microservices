package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.dto.SystemMetricsResponse;
import com.dashboard.monitoring.service.SystemMetricsService;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import java.lang.management.ThreadMXBean;

@Service
public class SystemMetricsServiceImpl implements SystemMetricsService {

    @Override
    public SystemMetricsResponse getSystemMetrics() {

        MemoryMXBean memoryBean =
                ManagementFactory.getMemoryMXBean();

        MemoryUsage heap =
                memoryBean.getHeapMemoryUsage();

        ThreadMXBean threadBean =
                ManagementFactory.getThreadMXBean();

        Runtime runtime =
                Runtime.getRuntime();

        double memoryUsage =
                ((double) heap.getUsed() / heap.getMax()) * 100;

        long uptime =
                ManagementFactory.getRuntimeMXBean()
                        .getUptime();

        return SystemMetricsResponse.builder()

                .cpuUsage(getCpuUsage())

                .memoryUsage(
                        Math.round(memoryUsage * 100.0) / 100.0
                )

                .heapUsed(heap.getUsed())

                .heapMax(heap.getMax())

                .threadCount(threadBean.getThreadCount())

                .uptime(formatUptime(uptime))

                .build();

    }

    private double getCpuUsage() {

        com.sun.management.OperatingSystemMXBean osBean =
                (com.sun.management.OperatingSystemMXBean)
                        ManagementFactory.getOperatingSystemMXBean();

        return Math.round(
                osBean.getCpuLoad() * 10000
        ) / 100.0;

    }

    private String formatUptime(long millis) {

        long seconds = millis / 1000;

        long minutes = seconds / 60;

        long hours = minutes / 60;

        return hours + "h "
                + (minutes % 60)
                + "m";

    }

}
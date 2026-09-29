package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.dto.SystemMetricsResponse;
import com.dashboard.monitoring.service.SystemMetricsService;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import java.lang.management.ThreadMXBean;

@Service
public class SystemMetricsServiceImpl
        implements SystemMetricsService {

    @Override
    public SystemMetricsResponse getSystemMetrics() {

        MemoryMXBean memoryBean =
                ManagementFactory.getMemoryMXBean();

        MemoryUsage heap =
                memoryBean.getHeapMemoryUsage();

        ThreadMXBean threadBean =
                ManagementFactory.getThreadMXBean();

        long heapUsed =
                Math.max(
                        heap.getUsed(),
                        0L
                );

        long heapMax =
                heap.getMax();

        /*
         * Some JVMs may report max heap as -1.
         * Use committed memory as a safe fallback.
         */
        if (heapMax <= 0) {

            heapMax =
                    Math.max(
                            heap.getCommitted(),
                            heapUsed
                    );
        }

        double memoryUsage = 0.0;

        if (heapMax > 0) {

            memoryUsage =
                    ((double) heapUsed / heapMax)
                            * 100.0;
        }

        long uptime =
                ManagementFactory
                        .getRuntimeMXBean()
                        .getUptime();

        return SystemMetricsResponse.builder()

                .cpuUsage(
                        getCpuUsage()
                )

                .memoryUsage(
                        round(memoryUsage)
                )

                .heapUsed(
                        heapUsed
                )

                .heapMax(
                        heapMax
                )

                .threadCount(
                        threadBean.getThreadCount()
                )

                .uptime(
                        formatUptime(uptime)
                )

                .build();
    }


    private double getCpuUsage() {

        com.sun.management
                .OperatingSystemMXBean osBean =
                (com.sun.management
                        .OperatingSystemMXBean)
                        ManagementFactory
                                .getOperatingSystemMXBean();

        double cpuLoad =
                osBean.getCpuLoad();

        /*
         * JVM can return a negative value when
         * CPU load is temporarily unavailable.
         */
        if (cpuLoad < 0) {
            return 0.0;
        }

        return round(
                cpuLoad * 100.0
        );
    }


    private double round(
            double value
    ) {

        return Math.round(
                value * 100.0
        ) / 100.0;
    }


    private String formatUptime(
            long millis
    ) {

        long totalSeconds =
                millis / 1000;

        long days =
                totalSeconds / 86400;

        long hours =
                (totalSeconds % 86400) / 3600;

        long minutes =
                (totalSeconds % 3600) / 60;

        long seconds =
                totalSeconds % 60;


        if (days > 0) {

            return days + "d "
                    + hours + "h "
                    + minutes + "m";
        }

        if (hours > 0) {

            return hours + "h "
                    + minutes + "m";
        }

        return minutes + "m "
                + seconds + "s";
    }
}
package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.dto.ServiceRuntimeResponse;
import com.dashboard.monitoring.service.RuntimeMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RuntimeMonitoringServiceImpl
        implements RuntimeMonitoringService {

    private final WebClient.Builder webClientBuilder;

    private final Map<String, String> serviceUrls = Map.of(
            "API Gateway", "http://localhost:8080",
            "Authentication", "http://localhost:8081",
            "User Service", "http://localhost:8082",
            "Order Service", "http://localhost:8083",
            "Payment Service", "http://localhost:8084",
            "Catalog Service", "http://localhost:8085",
            "Dashboard Service", "http://localhost:8086"
    );

    @Override
    public List<ServiceRuntimeResponse> getAllServicesRuntime() {

        return serviceUrls.entrySet()
                .stream()
                .map(entry ->
                        getRuntime(
                                entry.getKey(),
                                entry.getValue()
                        )
                )
                .toList();
    }

    private ServiceRuntimeResponse getRuntime(
            String serviceName,
            String baseUrl
    ) {

        try {

            WebClient client = webClientBuilder
                    .baseUrl(baseUrl)
                    .build();

            Double cpuUsage =
                    getMetric(client, "system.cpu.usage");

            Long memoryUsed =
                    getMetric(client, "jvm.memory.used")
                            .longValue();

            Long memoryMax =
                    getMetric(client, "jvm.memory.max")
                            .longValue();

            Integer threads =
                    getMetric(client, "jvm.threads.live")
                            .intValue();

            Double uptime =
                    getMetric(client, "process.uptime");

            return ServiceRuntimeResponse.builder()
                    .serviceName(serviceName)
                    .cpuUsage(cpuUsage * 100)
                    .memoryUsed(memoryUsed)
                    .memoryMax(memoryMax)
                    .threads(threads)
                    .uptimeSeconds(uptime)
                    .build();

        } catch (Exception ex) {

            return ServiceRuntimeResponse.builder()
                    .serviceName(serviceName)
                    .cpuUsage(0.0)
                    .memoryUsed(0L)
                    .memoryMax(0L)
                    .threads(0)
                    .uptimeSeconds(0.0)
                    .build();
        }
    }

    private Double getMetric(
            WebClient client,
            String metric
    ) {

        Map<?, ?> response = client.get()
                .uri("/actuator/metrics/{metric}", metric)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null ||
                response.get("measurements") == null) {
            return 0.0;
        }

        List<?> measurements =
                (List<?>) response.get("measurements");

        if (measurements.isEmpty()) {
            return 0.0;
        }

        Map<?, ?> measurement =
                (Map<?, ?>) measurements.get(0);

        Object value = measurement.get("value");

        if (value instanceof Number number) {
            return number.doubleValue();
        }

        return 0.0;
    }
}
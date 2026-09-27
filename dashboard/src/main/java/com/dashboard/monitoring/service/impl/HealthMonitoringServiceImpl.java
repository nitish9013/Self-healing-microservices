package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.client.*;
import com.dashboard.monitoring.dto.ServiceHealthResponse;
import com.dashboard.monitoring.service.HealthMonitoringService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Supplier;

@Slf4j
@Service
@RequiredArgsConstructor
public class HealthMonitoringServiceImpl
        implements HealthMonitoringService {

    private final GatewayHealthClient gatewayHealthClient;
    private final AuthHealthClient authHealthClient;
    private final UserHealthClient userHealthClient;
    private final CatalogHealthClient catalogHealthClient;
    private final OrderHealthClient orderHealthClient;
    private final PaymentHealthClient paymentHealthClient;
    private final DashboardHealthClient dashboardHealthClient;

    @Override
    public List<ServiceHealthResponse> getAllServicesHealth() {

        log.info("Starting health check for all monitored services");

        List<ServiceHealthResponse> services = List.of(
                check(
                        "API Gateway",
                        () -> gatewayHealthClient.health().getStatus()
                ),

                check(
                        "Authentication",
                        () -> authHealthClient.health().getStatus()
                ),

                check(
                        "User Service",
                        () -> userHealthClient.health().getStatus()
                ),

                check(
                        "Catalog Service",
                        () -> catalogHealthClient.health().getStatus()
                ),

                check(
                        "Order Service",
                        () -> orderHealthClient.health().getStatus()
                ),

                check(
                        "Payment Service",
                        () -> paymentHealthClient.health().getStatus()
                ),

                check(
                        "Dashboard Service",
                        () -> dashboardHealthClient.health().getStatus()
                )
        );

        long downServices = services.stream()
                .filter(service -> "DOWN".equalsIgnoreCase(service.getStatus()))
                .count();

        if (downServices > 0) {
            log.warn(
                    "Health check completed with {} service(s) DOWN",
                    downServices
            );
        } else {
            log.info("Health check completed successfully. All services are UP");
        }

        return services;
    }

    private ServiceHealthResponse check(
            String serviceName,
            Supplier<String> healthCheck
    ) {

        long start = System.currentTimeMillis();

        log.debug("Checking health of service: {}", serviceName);

        try {

            String status = healthCheck.get();

            long responseTime =
                    System.currentTimeMillis() - start;

            if ("UP".equalsIgnoreCase(status)) {

                log.info(
                        "Service health check successful: service={}, status={}, responseTime={}ms",
                        serviceName,
                        status,
                        responseTime
                );

            } else {

                log.warn(
                        "Service health check returned non-UP status: service={}, status={}, responseTime={}ms",
                        serviceName,
                        status,
                        responseTime
                );
            }

            return ServiceHealthResponse.builder()
                    .serviceName(serviceName)
                    .status(status)
                    .responseTime(responseTime)
                    .checkedAt(LocalDateTime.now())
                    .build();

        } catch (Exception ex) {

            long responseTime =
                    System.currentTimeMillis() - start;

            log.error(
                    "Service health check failed: service={}, responseTime={}ms, error={}",
                    serviceName,
                    responseTime,
                    ex.getMessage(),
                    ex
            );

            return ServiceHealthResponse.builder()
                    .serviceName(serviceName)
                    .status("DOWN")
                    .responseTime(responseTime)
                    .checkedAt(LocalDateTime.now())
                    .build();
        }
    }
}
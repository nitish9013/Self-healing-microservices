package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.client.*;
import com.dashboard.monitoring.dto.ServiceHealthResponse;
import com.dashboard.monitoring.service.HealthMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Supplier;

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

        return List.of(
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
    }

    private ServiceHealthResponse check(
            String serviceName,
            Supplier<String> healthCheck
    ) {

        long start = System.currentTimeMillis();

        try {

            String status = healthCheck.get();

            long responseTime =
                    System.currentTimeMillis() - start;

            return ServiceHealthResponse.builder()
                    .serviceName(serviceName)
                    .status(status)
                    .responseTime(responseTime)
                    .checkedAt(LocalDateTime.now())
                    .build();

        } catch (Exception ex) {

            long responseTime =
                    System.currentTimeMillis() - start;

            return ServiceHealthResponse.builder()
                    .serviceName(serviceName)
                    .status("DOWN")
                    .responseTime(responseTime)
                    .checkedAt(LocalDateTime.now())
                    .build();
        }
    }
}
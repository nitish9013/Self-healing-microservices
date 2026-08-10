package com.dashboard.monitoring.service.impl;

import com.dashboard.monitoring.client.*;
import com.dashboard.monitoring.dto.ServiceHealthResponse;
import com.dashboard.monitoring.service.HealthMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

                build("Gateway", gatewayHealthClient.health().getStatus()),

                build("Authentication", authHealthClient.health().getStatus()),
//
                build("User", userHealthClient.health().getStatus()),
//
                build("Catalog", catalogHealthClient.health().getStatus()),
//
                build("Order", orderHealthClient.health().getStatus()),

                build("Payment", paymentHealthClient.health().getStatus()),

                build("Dashboard", dashboardHealthClient.health().getStatus())

        );

    }

    private ServiceHealthResponse build(
            String service,
            String status
    ) {

        return ServiceHealthResponse.builder()
                .serviceName(service)
                .status(status)
                .responseTime(0L)
                .checkedAt(LocalDateTime.now())
                .build();

    }

}
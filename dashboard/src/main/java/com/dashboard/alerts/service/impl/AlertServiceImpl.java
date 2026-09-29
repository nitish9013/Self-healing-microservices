package com.dashboard.alerts.service.impl;

import com.dashboard.alerts.dto.AlertResponse;
import com.dashboard.alerts.service.AlertService;
import com.dashboard.monitoring.dto.CircuitBreakerResponse;
import com.dashboard.monitoring.dto.RetryMonitoringResponse;
import com.dashboard.monitoring.dto.ServiceHealthResponse;
import com.dashboard.monitoring.service.CircuitBreakerMonitoringService;
import com.dashboard.monitoring.service.HealthMonitoringService;
import com.dashboard.monitoring.service.RetryMonitoringService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final HealthMonitoringService healthMonitoringService;

    private final CircuitBreakerMonitoringService
            circuitBreakerMonitoringService;

    private final RetryMonitoringService
            retryMonitoringService;


    @Override
    public List<AlertResponse> getActiveAlerts(
            String service,
            String severity,
            String type
    ) {

        List<AlertResponse> alerts =
                new ArrayList<>();

        LocalDateTime detectedAt =
                LocalDateTime.now();


        /*
         * ============================================
         * SERVICE HEALTH ALERTS
         * ============================================
         */

        List<ServiceHealthResponse> services =
                healthMonitoringService
                        .getAllServicesHealth();

        for (ServiceHealthResponse serviceHealth : services) {

            String status =
                    serviceHealth.getStatus();

            if (status == null) {
                continue;
            }

            if (!"UP".equalsIgnoreCase(status)) {

                String serviceName =
                        serviceHealth.getServiceName();

                String severityValue =
                        "DOWN".equalsIgnoreCase(status)
                                ? "CRITICAL"
                                : "WARNING";

                AlertResponse alert =
                        AlertResponse.builder()

                                .id(
                                        createAlertId(
                                                "SERVICE",
                                                serviceName
                                        )
                                )

                                .serviceName(
                                        serviceName
                                )

                                .type(
                                        "SERVICE_HEALTH"
                                )

                                .severity(
                                        severityValue
                                )

                                .status(
                                        "ACTIVE"
                                )

                                .message(
                                        "Service "
                                                + serviceName
                                                + " is currently "
                                                + status
                                )

                                .detectedAt(
                                        detectedAt
                                )

                                .build();

                alerts.add(alert);
            }
        }


        /*
         * ============================================
         * CIRCUIT BREAKER ALERT
         * ============================================
         */

        CircuitBreakerResponse
                circuitBreaker =
                circuitBreakerMonitoringService
                        .getCircuitBreakerStatus();

        if (circuitBreaker != null
                && circuitBreaker.getState() != null) {

            String state =
                    circuitBreaker
                            .getState()
                            .toUpperCase(Locale.ROOT);

            if ("OPEN".equals(state)) {

                alerts.add(
                        AlertResponse.builder()

                                .id(
                                        createAlertId(
                                                "CIRCUIT_BREAKER",
                                                circuitBreaker.getName()
                                        )
                                )

                                .serviceName(
                                        circuitBreaker.getName()
                                )

                                .type(
                                        "CIRCUIT_BREAKER"
                                )

                                .severity(
                                        "CRITICAL"
                                )

                                .status(
                                        "ACTIVE"
                                )

                                .message(
                                        "Circuit breaker "
                                                + circuitBreaker.getName()
                                                + " is OPEN"
                                )

                                .detectedAt(
                                        detectedAt
                                )

                                .build()
                );

            } else if ("HALF_OPEN".equals(state)) {

                alerts.add(
                        AlertResponse.builder()

                                .id(
                                        createAlertId(
                                                "CIRCUIT_BREAKER",
                                                circuitBreaker.getName()
                                        )
                                )

                                .serviceName(
                                        circuitBreaker.getName()
                                )

                                .type(
                                        "CIRCUIT_BREAKER"
                                )

                                .severity(
                                        "WARNING"
                                )

                                .status(
                                        "ACTIVE"
                                )

                                .message(
                                        "Circuit breaker "
                                                + circuitBreaker.getName()
                                                + " is HALF_OPEN and testing recovery"
                                )

                                .detectedAt(
                                        detectedAt
                                )

                                .build()
                );
            }
        }


        /*
         * ============================================
         * RETRY ALERT
         * ============================================
         */

        RetryMonitoringResponse
                retryStats =
                retryMonitoringService
                        .getRetryStats();

        if (retryStats != null
                && retryStats.getFailedRetries() > 0) {

            alerts.add(
                    AlertResponse.builder()

                            .id(
                                    createAlertId(
                                            "RETRY",
                                            "dashboardRetry"
                                    )
                            )

                            .serviceName(
                                    "Dashboard Service"
                            )

                            .type(
                                    "RETRY_FAILURE"
                            )

                            .severity(
                                    "WARNING"
                            )

                            .status(
                                    "ACTIVE"
                            )

                            .message(
                                    "Retry failures recorded: "
                                            + retryStats.getFailedRetries()
                            )

                            .detectedAt(
                                    detectedAt
                            )

                            .build()
            );
        }


        /*
         * ============================================
         * FILTERS
         * ============================================
         */

        return alerts.stream()

                .filter(alert ->
                        matches(
                                alert.getServiceName(),
                                service
                        )
                )

                .filter(alert ->
                        matches(
                                alert.getSeverity(),
                                severity
                        )
                )

                .filter(alert ->
                        matches(
                                alert.getType(),
                                type
                        )
                )

                .toList();
    }


    private boolean matches(
            String actual,
            String expected
    ) {

        if (expected == null
                || expected.isBlank()) {

            return true;
        }

        return actual != null
                && actual.equalsIgnoreCase(
                expected.trim()
        );
    }


    private String createAlertId(
            String type,
            String source
    ) {

        return type
                + "-"
                + source
                + "-"
                + UUID.randomUUID();
    }
}
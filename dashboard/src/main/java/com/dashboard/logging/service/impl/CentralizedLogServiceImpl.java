package com.dashboard.logging.service.impl;

import com.dashboard.logging.dto.CentralizedLogResponse;
import com.dashboard.logging.service.CentralizedLogService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.*;
import java.util.stream.Stream;

@Slf4j
@Service
public class CentralizedLogServiceImpl
        implements CentralizedLogService {

    private final ObjectMapper objectMapper;

    private final Map<String, String> logSources;

    private final int maxResults;

    public CentralizedLogServiceImpl(
            ObjectMapper objectMapper,

            @Value("${logs.auth:../authentication/logs/authentication.json}")
            String authLog,

            @Value("${logs.user:../users/logs/users.json}")
            String userLog,

            @Value("${logs.catalog:../catalog/logs/catalog-service.json}")
            String catalogLog,

            @Value("${logs.order:../order/logs/order-service.json}")
            String orderLog,

            @Value("${logs.payment:../payment/logs/Payment.json}")
            String paymentLog,

            @Value("${logs.gateway:../gateway/logs/gateway.json}")
            String gatewayLog,

            @Value("${logs.dashboard:logs/dashboard.json}")
            String dashboardLog,

            @Value("${logs.max-results:500}")
            int maxResults
    ) {

        this.objectMapper = objectMapper;
        this.maxResults = maxResults;

        this.logSources = new LinkedHashMap<>();

        logSources.put("AUTH", authLog);
        logSources.put("USER", userLog);
        logSources.put("CATALOG", catalogLog);
        logSources.put("ORDER", orderLog);
        logSources.put("PAYMENT", paymentLog);
        logSources.put("GATEWAY", gatewayLog);
        logSources.put("DASHBOARD", dashboardLog);
    }

    @Override
    public List<CentralizedLogResponse> getLogs(
            String service,
            String level,
            String search,
            int limit
    ) {

        log.info(
                "Centralized log collection started: service={}, level={}, search={}, limit={}",
                service,
                level,
                search,
                limit
        );

        int effectiveLimit = Math.min(
                Math.max(limit, 1),
                maxResults
        );

        List<CentralizedLogResponse> logs =
                new ArrayList<>();

        if (service != null
                && !service.isBlank()) {

            String normalizedService =
                    service.trim().toUpperCase();

            String path =
                    logSources.get(normalizedService);

            if (path == null) {

                log.warn(
                        "Unknown log service requested: service={}",
                        service
                );

                return List.of();
            }

            readLogFile(
                    normalizedService,
                    path,
                    logs
            );

        } else {

            logSources.forEach(
                    (serviceName, path) ->
                            readLogFile(
                                    serviceName,
                                    path,
                                    logs
                            )
            );
        }

        List<CentralizedLogResponse> filtered =
                logs.stream()
                        .filter(logEntry ->
                                matchesLevel(
                                        logEntry,
                                        level
                                )
                        )
                        .filter(logEntry ->
                                matchesSearch(
                                        logEntry,
                                        search
                                )
                        )
                        .sorted(
                                Comparator.comparing(
                                        CentralizedLogResponse::getTimestamp,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .limit(effectiveLimit)
                        .toList();

        log.info(
                "Centralized log collection completed: totalRead={}, totalReturned={}",
                logs.size(),
                filtered.size()
        );

        return filtered;
    }

    private void readLogFile(
            String service,
            String filePath,
            List<CentralizedLogResponse> logs
    ) {

        Path path =
                Path.of(filePath).toAbsolutePath().normalize();

        if (!Files.exists(path)) {

            log.debug(
                    "Log file does not exist: service={}, path={}",
                    service,
                    path
            );

            return;
        }

        try (Stream<String> lines =
                     Files.lines(path)) {

            lines.filter(line ->
                            line != null
                                    && !line.isBlank()
                    )
                    .forEach(line ->
                            parseLogLine(
                                    service,
                                    line,
                                    logs
                            )
                    );

        } catch (IOException ex) {

            log.error(
                    "Failed to read log file: service={}, path={}, error={}",
                    service,
                    path,
                    ex.getMessage(),
                    ex
            );
        }
    }

    private void parseLogLine(
            String service,
            String line,
            List<CentralizedLogResponse> logs
    ) {

        try {

            JsonNode node =
                    objectMapper.readTree(line);

            String timestampValue =
                    getText(
                            node,
                            "@timestamp"
                    );

            Instant timestamp = null;

            if (timestampValue != null) {

                try {

                    timestamp =
                            Instant.parse(timestampValue);

                } catch (Exception ignored) {

                    log.debug(
                            "Unable to parse log timestamp: {}",
                            timestampValue
                    );
                }
            }

            logs.add(
                    CentralizedLogResponse.builder()
                            .timestamp(timestamp)
                            .service(service)
                            .level(
                                    getText(
                                            node,
                                            "level"
                                    )
                            )
                            .loggerName(
                                    getText(
                                            node,
                                            "logger_name"
                                    )
                            )
                            .message(
                                    getText(
                                            node,
                                            "message"
                                    )
                            )
                            .stackTrace(
                                    getText(
                                            node,
                                            "stack_trace"
                                    )
                            )
                            .build()
            );

        } catch (Exception ex) {

            log.debug(
                    "Skipping invalid JSON log entry from service={}",
                    service
            );
        }
    }

    private String getText(
            JsonNode node,
            String field
    ) {

        JsonNode value =
                node.get(field);

        if (value == null
                || value.isNull()) {

            return null;
        }

        return value.asText();
    }

    private boolean matchesLevel(
            CentralizedLogResponse logEntry,
            String level
    ) {

        if (level == null
                || level.isBlank()) {

            return true;
        }

        return level.equalsIgnoreCase(
                logEntry.getLevel()
        );
    }

    private boolean matchesSearch(
            CentralizedLogResponse logEntry,
            String search
    ) {

        if (search == null
                || search.isBlank()) {

            return true;
        }

        String keyword =
                search.toLowerCase();

        return contains(
                logEntry.getMessage(),
                keyword
        )
                || contains(
                logEntry.getLoggerName(),
                keyword
        )
                || contains(
                logEntry.getService(),
                keyword
        );
    }

    private boolean contains(
            String value,
            String keyword
    ) {

        return value != null
                && value.toLowerCase()
                .contains(keyword);
    }
}
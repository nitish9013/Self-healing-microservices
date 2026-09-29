package com.dashboard.alerts.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {

    private String id;

    private String serviceName;

    private String type;

    private String severity;

    private String status;

    private String message;

    private LocalDateTime detectedAt;
}
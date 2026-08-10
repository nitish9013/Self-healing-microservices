package com.dashboard.monitoring.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceHealthResponse {

    private String serviceName;

    private String status;

    private Long responseTime;

    private LocalDateTime checkedAt;

}
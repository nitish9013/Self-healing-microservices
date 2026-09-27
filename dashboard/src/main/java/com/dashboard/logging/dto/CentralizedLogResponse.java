package com.dashboard.logging.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CentralizedLogResponse {

    private Instant timestamp;

    private String service;

    private String level;

    private String loggerName;

    private String message;

    private String stackTrace;
}
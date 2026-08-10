package com.dashboard.monitoring.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CircuitBreakerResponse {

    private String name;

    private String state;

}
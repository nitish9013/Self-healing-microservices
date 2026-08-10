package com.dashboard.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private String adminName;

    private String systemStatus;

    private Integer totalServices;

    private Integer activeServices;

    private LocalDateTime serverTime;

}
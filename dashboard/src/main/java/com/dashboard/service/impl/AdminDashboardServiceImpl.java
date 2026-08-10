package com.dashboard.service.impl;

import com.dashboard.dto.response.AdminDashboardResponse;
import com.dashboard.service.AdminDashboardService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminDashboardServiceImpl
        implements AdminDashboardService {

    @Override
    public AdminDashboardResponse getAdminDashboard() {

        return AdminDashboardResponse.builder()
                .adminName("Administrator")
                .systemStatus("RUNNING")
                .totalServices(7)
                .activeServices(7)
                .serverTime(LocalDateTime.now())
                .build();
    }
}
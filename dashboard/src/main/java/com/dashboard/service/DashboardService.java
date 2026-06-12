package com.dashboard.service;

import com.dashboard.dto.response.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard(
            Long userId);
}
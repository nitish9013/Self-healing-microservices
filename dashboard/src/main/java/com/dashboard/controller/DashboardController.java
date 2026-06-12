package com.dashboard.controller;

import com.dashboard.dto.response.DashboardResponse;
import com.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/home/{userId}")
    public DashboardResponse getDashboard(
            @PathVariable Long userId) {

        return dashboardService
                .getDashboard(userId);
    }
}
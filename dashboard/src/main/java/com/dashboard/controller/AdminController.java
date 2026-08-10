package com.dashboard.controller;

import com.dashboard.dto.response.AdminDashboardResponse;
import com.dashboard.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminDashboardService service;

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        return service.getAdminDashboard();

    }

}
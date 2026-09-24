package com.dashboard.controller;

import com.dashboard.dto.response.AdminAnalyticsResponse;
import com.dashboard.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    @GetMapping("/analytics")
    public AdminAnalyticsResponse getAnalytics() {

        System.out.println("🔥 ADMIN ANALYTICS REQUEST REACHED DASHBOARD");

        AdminAnalyticsResponse response = analyticsService.getAnalytics();

        System.out.println("🔥 ADMIN ANALYTICS RESPONSE CREATED");

        return response;
    }

}
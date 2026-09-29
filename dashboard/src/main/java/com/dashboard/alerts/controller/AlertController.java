package com.dashboard.alerts.controller;

import com.dashboard.alerts.dto.AlertResponse;
import com.dashboard.alerts.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;


    @GetMapping
    public List<AlertResponse> getAlerts(

            @RequestParam(
                    required = false
            )
            String service,

            @RequestParam(
                    required = false
            )
            String severity,

            @RequestParam(
                    required = false
            )
            String type

    ) {

        return alertService.getActiveAlerts(
                service,
                severity,
                type
        );
    }
}
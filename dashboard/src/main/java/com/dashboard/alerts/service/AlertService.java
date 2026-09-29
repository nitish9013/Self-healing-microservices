package com.dashboard.alerts.service;

import com.dashboard.alerts.dto.AlertResponse;

import java.util.List;

public interface AlertService {

    List<AlertResponse> getActiveAlerts(
            String service,
            String severity,
            String type
    );
}
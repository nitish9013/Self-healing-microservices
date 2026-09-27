package com.dashboard.logging.service;

import com.dashboard.logging.dto.CentralizedLogResponse;

import java.util.List;

public interface CentralizedLogService {

    List<CentralizedLogResponse> getLogs(
            String service,
            String level,
            String search,
            int limit
    );
}
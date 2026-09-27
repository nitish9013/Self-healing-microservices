package com.dashboard.logging.controller;

import com.dashboard.logging.dto.CentralizedLogResponse;
import com.dashboard.logging.service.CentralizedLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/logs")
@RequiredArgsConstructor
public class CentralizedLogController {

    private final CentralizedLogService centralizedLogService;

    @GetMapping
    public List<CentralizedLogResponse> getLogs(

            @RequestParam(required = false)
            String service,

            @RequestParam(required = false)
            String level,

            @RequestParam(required = false)
            String search,

            @RequestParam(defaultValue = "100")
            int limit

    ) {

        return centralizedLogService.getLogs(
                service,
                level,
                search,
                limit
        );
    }
}
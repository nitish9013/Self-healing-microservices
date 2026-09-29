package com.dashboard.controller;

import com.dashboard.dto.response.KafkaMonitoringResponse;
import com.dashboard.service.KafkaMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class KafkaMonitoringController {

    private final KafkaMonitoringService
            kafkaMonitoringService;


    @GetMapping("/kafka")
    public KafkaMonitoringResponse getKafkaStatus() {

        return kafkaMonitoringService
                .getKafkaStatus();
    }

    @GetMapping("/kafka/overview")
    public KafkaMonitoringResponse getKafkaOverview() {

        return kafkaMonitoringService.getKafkaStatus();
    }
}
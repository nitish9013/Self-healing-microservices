package com.dashboard.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "payment-service",
        url = "${payment.service.url}"
)
public interface PaymentFeignClient {

    @GetMapping("/api/payments/count")
    Long getTotalPayments();

    @GetMapping("/api/payments/revenue")
    Double getTotalRevenue();

    @GetMapping("/api/payments/failed/count")
    Long getFailedPayments();

}
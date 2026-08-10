package com.dashboard.feign;

import com.dashboard.dto.response.OrderSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "order-service",
        url = "${order.service.url}"
)
public interface OrderFeignClient {

    @GetMapping("/api/orders/user/{username}")
    List<OrderSummaryResponse> getOrders(
            @PathVariable String username
    );

    @GetMapping("/api/orders/count")
    Long getTotalOrders();

    @GetMapping("/api/orders/pending/count")
    Long getPendingOrders();
}
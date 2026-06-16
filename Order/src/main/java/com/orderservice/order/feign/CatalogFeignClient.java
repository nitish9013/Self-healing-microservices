package com.orderservice.order.feign;

import com.orderservice.order.dto.ProductResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "catalog-service",
        url = "${catalog.service.url}"
)
public interface CatalogFeignClient {

    @GetMapping("/api/products/{id}")
    ProductResponse getProduct(
            @PathVariable String id
    );
}
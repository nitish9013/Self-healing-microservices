package com.orderservice.order.service;

import com.orderservice.order.dto.ProductResponse;
import com.orderservice.order.exception.CatalogServiceUnavailableException;
import com.orderservice.order.feign.CatalogFeignClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CatalogServiceClient {

    private final CatalogFeignClient catalogFeignClient;

    @Retry(name = "catalogRetry")
    @CircuitBreaker(
            name = "catalogService",
            fallbackMethod = "catalogFallback"
    )
    public ProductResponse getProduct(String productId) {

        System.out.println(
                "Calling Catalog Service for product: "
                        + productId
        );

        return catalogFeignClient.getProduct(productId);
    }

    public ProductResponse catalogFallback(
            String productId,
            Exception exception) {

        System.out.println(
                "CATALOG FALLBACK TRIGGERED"
        );

        System.out.println(
                "Product ID: " + productId
        );

        System.out.println(
                "Reason: " + exception.getMessage()
        );

        throw new CatalogServiceUnavailableException(
                "Catalog Service is temporarily unavailable. "
                        + "Please try again later.",
                exception
        );
    }
}
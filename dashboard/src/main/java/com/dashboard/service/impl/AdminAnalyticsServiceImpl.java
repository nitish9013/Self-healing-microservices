package com.dashboard.service.impl;

import com.dashboard.dto.response.AdminAnalyticsResponse;
import com.dashboard.feign.CatalogFeignClient;
import com.dashboard.feign.OrderFeignClient;
import com.dashboard.feign.PaymentFeignClient;
import com.dashboard.feign.UserFeignClient;
import com.dashboard.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.dashboard.monitoring.retry.RetryMetrics;
import io.github.resilience4j.retry.annotation.Retry;

@Service
@RequiredArgsConstructor

public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {
    private final UserFeignClient userFeignClient;

    private final CatalogFeignClient catalogFeignClient;

    private final OrderFeignClient orderFeignClient;

    private final PaymentFeignClient paymentFeignClient;
    private final RetryMetrics retryMetrics;



    @Retry(
            name = "dashboardRetry",
            fallbackMethod = "analyticsFallback"
    )
    @Override
    public AdminAnalyticsResponse getAnalytics() {

        retryMetrics.incrementRetry();

        AdminAnalyticsResponse response = AdminAnalyticsResponse.builder()

                .totalUsers(
                        userFeignClient.getTotalUsers()
                )

                .totalProducts(
                        catalogFeignClient.getTotalProducts()
                )

                .totalCategories(
                        catalogFeignClient.getTotalCategories()
                )

                .totalOrders(
                        orderFeignClient.getTotalOrders()
                )

                .totalPayments(
                        paymentFeignClient.getTotalPayments()
                )

                .totalRevenue(
                        paymentFeignClient.getTotalRevenue()
                )

                .pendingOrders(
                        orderFeignClient.getPendingOrders()
                )

                .failedPayments(
                        paymentFeignClient.getFailedPayments()
                )

                .build();

        retryMetrics.incrementSuccess();

        return response;
    }
    public AdminAnalyticsResponse analyticsFallback(Exception ex) {

        retryMetrics.incrementFailure();

        return AdminAnalyticsResponse.builder()

                .totalUsers(0L)
                .totalProducts(0L)
                .totalCategories(0L)
                .totalOrders(0L)
                .totalPayments(0L)
                .totalRevenue(0.0)
                .pendingOrders(0L)
                .failedPayments(0L)

                .build();
    }
}
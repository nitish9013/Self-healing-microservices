package com.dashboard.service.impl;

import com.dashboard.dto.response.*;
import com.dashboard.feign.CatalogFeignClient;
import com.dashboard.feign.OrderFeignClient;
import com.dashboard.feign.UserFeignClient;
import com.dashboard.service.DashboardService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserFeignClient userFeignClient;
    private final CatalogFeignClient catalogFeignClient;
    private final OrderFeignClient orderFeignClient;

    @Override
    @Retry(name = "dashboardRetry")
    @CircuitBreaker(name = "dashboardService", fallbackMethod = "dashboardFallback")
    public DashboardResponse getDashboard(Long userId) {
        log.info("Fetching dashboard data for userId={}", userId);

        UserSummaryResponse user;
        try {
            user = userFeignClient.getUser(userId);
        } catch (Exception ex) {
            log.warn("Failed to fetch user summary for userId={}, using fallback user: {}", userId, ex.getMessage());
            user = UserSummaryResponse.builder()
                    .userId(userId)
                    .name("User #" + userId)
                    .email("user" + userId + "@shdep.local")
                    .build();
        }

        List<CategorySummaryResponse> categories;
        try {
            categories = catalogFeignClient.getCategories();
            if (categories == null) categories = Collections.emptyList();
        } catch (Exception ex) {
            log.warn("Failed to fetch categories from CatalogService: {}", ex.getMessage());
            categories = Collections.emptyList();
        }

        List<ProductSummaryResponse> products;
        try {
            products = catalogFeignClient.getProducts();
            if (products == null) products = Collections.emptyList();
        } catch (Exception ex) {
            log.warn("Failed to fetch products from CatalogService: {}", ex.getMessage());
            products = Collections.emptyList();
        }

        List<OrderSummaryResponse> orders;
        try {
            orders = orderFeignClient.getOrders(user.getEmail());
            if (orders == null) orders = Collections.emptyList();
        } catch (Exception ex) {
            log.warn("Failed to fetch orders from OrderService for email={}: {}", user.getEmail(), ex.getMessage());
            orders = Collections.emptyList();
        }

        return DashboardResponse.builder()
                .user(user)
                .categories(categories)
                .featuredProducts(products)
                .recentOrders(orders)
                .build();
    }

    public DashboardResponse dashboardFallback(Long userId, Exception ex) {
        log.error("Global dashboard fallback triggered for userId={}: {}", userId, ex.getMessage(), ex);

        return DashboardResponse.builder()
                .user(UserSummaryResponse.builder()
                        .userId(userId)
                        .name("System In Recovery")
                        .email("recovery@shdep.local")
                        .build())
                .categories(Collections.emptyList())
                .featuredProducts(Collections.emptyList())
                .recentOrders(Collections.emptyList())
                .build();
    }
}
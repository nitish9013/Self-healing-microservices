package com.dashboard.service.impl;

import com.dashboard.client.CatalogClient;
import com.dashboard.client.OrderClient;
import com.dashboard.client.UserClient;
import com.dashboard.dto.response.*;
import com.dashboard.feign.CatalogFeignClient;
import com.dashboard.feign.OrderFeignClient;
import com.dashboard.feign.UserFeignClient;
import com.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

//    private final UserClient userClient;
//    private final CatalogClient catalogClient;
private final UserFeignClient userFeignClient;
    private final CatalogFeignClient catalogFeignClient;
    private final OrderFeignClient orderFeignClient;

    private final OrderClient orderClient;

    @Override
    @Retry(

            name = "dashboardRetry"


    )
    @CircuitBreaker(
            name = "dashboardService",
            fallbackMethod = "dashboardFallback"
    )

    public DashboardResponse getDashboard(
            Long userId) {
        System.out.println(
                "Retry Attempt"
        );

//        UserSummaryResponse user =
//                userClient.getUser(userId);
//
//        List<CategorySummaryResponse>
//                categories =
//                catalogClient.getCategories();
//
//        List<ProductSummaryResponse>
//                products =
//                catalogClient.getProducts();

        UserSummaryResponse user =
                userFeignClient.getUser(userId);

        List<CategorySummaryResponse> categories =
                catalogFeignClient.getCategories();

        List<ProductSummaryResponse> products =
                catalogFeignClient.getProducts();

        List<OrderSummaryResponse> orders =
                orderFeignClient.getOrders(
                        user.getEmail());


        return DashboardResponse.builder()
                .user(user)
                .categories(categories)
                .featuredProducts(products)
                .recentOrders(orders)
                .build();
    }

    public DashboardResponse dashboardFallback(
            Long userId,
            Exception ex) {

//        System.out.println(
//                "Fallback Triggered : "
//                        + ex.getMessage());
        System.out.println("========== DASHBOARD FALLBACK ==========");
        System.out.println("Exception Type : " + ex.getClass().getName());
        System.out.println("Exception Message : " + ex.getMessage());
        ex.printStackTrace();
        System.out.println("========================================");

        return DashboardResponse.builder()
                .user(
                        UserSummaryResponse.builder()
                                .userId(userId)
                                .name("Service Unavailable")
                                .email("N/A")
                                .build()
                )
                .categories(List.of())
                .featuredProducts(List.of())
                .recentOrders(List.of())
                .build();
    }
}
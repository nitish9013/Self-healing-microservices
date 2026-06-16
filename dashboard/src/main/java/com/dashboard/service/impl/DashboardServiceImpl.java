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
    public DashboardResponse getDashboard(
            Long userId) {

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
}
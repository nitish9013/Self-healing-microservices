package com.dashboard.service.impl;

import com.dashboard.client.CatalogClient;
import com.dashboard.client.OrderClient;
import com.dashboard.client.UserClient;
import com.dashboard.dto.response.*;
import com.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final UserClient userClient;
    private final CatalogClient catalogClient;
    private final OrderClient orderClient;

    @Override
    public DashboardResponse getDashboard(
            Long userId) {

        UserSummaryResponse user =
                userClient.getUser(userId);

        List<CategorySummaryResponse>
                categories =
                catalogClient.getCategories();

        List<ProductSummaryResponse>
                products =
                catalogClient.getProducts();

        return DashboardResponse.builder()
                .user(user)
                .categories(categories)
                .featuredProducts(products)
                .recentOrders(List.of())
                .build();
    }
}
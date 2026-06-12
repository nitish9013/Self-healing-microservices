package com.dashboard.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private UserSummaryResponse user;

    private List<CategorySummaryResponse> categories;

    private List<ProductSummaryResponse> featuredProducts;

    private List<OrderSummaryResponse> recentOrders;
}
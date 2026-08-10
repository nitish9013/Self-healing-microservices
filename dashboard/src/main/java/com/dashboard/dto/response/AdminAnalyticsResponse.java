package com.dashboard.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {

    private Long totalUsers;

    private Long totalProducts;

    private Long totalCategories;

    private Long totalOrders;

    private Long totalPayments;

    private Double totalRevenue;

    private Long pendingOrders;

    private Long failedPayments;

}
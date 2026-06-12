package com.dashboard.client;

import com.dashboard.dto.response.OrderSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderClient {

    private final WebClient webClient;

    @Value("${order.service.url}")
    private String orderServiceUrl;

    public List<OrderSummaryResponse>
    getOrders(String username) {

        return webClient.get()
                .uri(orderServiceUrl +
                        "/api/orders/user/" +
                        username)
                .retrieve()
                .bodyToMono(
                        new ParameterizedTypeReference<
                                List<OrderSummaryResponse>>() {})
                .block();
    }
}
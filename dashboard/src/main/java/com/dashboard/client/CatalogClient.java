package com.dashboard.client;

import com.dashboard.dto.response.CategorySummaryResponse;
import com.dashboard.dto.response.ProductSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CatalogClient {

    private final WebClient webClient;

    @Value("${catalog.service.url}")
    private String catalogServiceUrl;

    public List<CategorySummaryResponse>
    getCategories() {

        return webClient.get()
                .uri(catalogServiceUrl +
                        "/api/categories")
                .retrieve()
                .bodyToMono(
                        new ParameterizedTypeReference<
                                List<CategorySummaryResponse>>() {})
                .block();
    }

    public List<ProductSummaryResponse>
    getProducts() {

        return webClient.get()
                .uri(catalogServiceUrl +
                        "/api/products/all")
                .retrieve()
                .bodyToMono(
                        new ParameterizedTypeReference<
                                List<ProductSummaryResponse>>() {})
                .block();
    }
}
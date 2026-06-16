package com.dashboard.feign;

import com.dashboard.dto.response.CategorySummaryResponse;
import com.dashboard.dto.response.ProductSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(
        name = "catalog-service",
        url = "${catalog.service.url}"
)
public interface CatalogFeignClient {

    @GetMapping("/api/categories")
    List<CategorySummaryResponse>
    getCategories();

    @GetMapping("/api/products/all")
    List<ProductSummaryResponse>
    getProducts();
}
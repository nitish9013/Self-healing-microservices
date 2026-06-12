package com.ecommerce.catalog.service;

import com.ecommerce.catalog.dto.request.ProductRequest;
import com.ecommerce.catalog.dto.response.ProductResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    ProductResponse createProduct(
            ProductRequest request);

    ProductResponse getProductById(
            UUID productId);

    Page<ProductResponse> getAllProducts(
            int page,
            int size);

    ProductResponse updateProduct(
            UUID productId,
            ProductRequest request);

    void deleteProduct(
            UUID productId);

    List<ProductResponse> searchProducts(
            String keyword);

    List<ProductResponse> getProductsByCategory(
            UUID categoryId);

    List<ProductResponse>
    getAllProductsWithoutPagination();
}
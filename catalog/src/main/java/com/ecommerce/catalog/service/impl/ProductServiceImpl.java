package com.ecommerce.catalog.service.impl;

import com.ecommerce.catalog.dto.request.ProductRequest;
import com.ecommerce.catalog.dto.response.ProductResponse;
import com.ecommerce.catalog.entity.Category;
import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.exception.ResourceNotFoundException;
import com.ecommerce.catalog.repository.CategoryRepository;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.catalog.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .active(true)
                .category(category)
                .build();

        Product savedProduct =
                productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    @Override
    public ProductResponse getProductById(UUID productId) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"));

        return mapToResponse(product);
    }

    @Override
    public Page<ProductResponse> getAllProducts(
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("createdAt")
                                .descending());

        return productRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public ProductResponse updateProduct(
            UUID productId,
            ProductRequest request) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"));

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(
                request.getStockQuantity());
        product.setImageUrl(
                request.getImageUrl());
        product.setCategory(category);

        Product updatedProduct =
                productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(UUID productId) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"));

        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> searchProducts(
            String keyword) {

        return productRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse>
    getProductsByCategory(UUID categoryId) {

        return productRepository
                .findByCategory_Id(categoryId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProductResponse mapToResponse(
            Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(
                        product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .active(product.getActive())
                .categoryId(
                        product.getCategory().getId())
                .categoryName(
                        product.getCategory().getName())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    @Override
    public List<ProductResponse>
    getAllProductsWithoutPagination() {

        return productRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}
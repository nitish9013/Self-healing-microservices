package com.ecommerce.catalog.controller;

import com.ecommerce.catalog.dto.request.ProductRequest;
import com.ecommerce.catalog.dto.response.ProductResponse;
import com.ecommerce.catalog.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ProductResponse createProduct(
            @Valid @RequestBody ProductRequest request) {

        return productService.createProduct(request);
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(
            @PathVariable UUID id) {

        return productService.getProductById(id);
    }

    @GetMapping
    public Page<ProductResponse> getAllProducts(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return productService.getAllProducts(page, size);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(

            @PathVariable UUID id,

            @Valid
            @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable UUID id) {

        productService.deleteProduct(id);
    }

    @GetMapping("/search")
    public List<ProductResponse> searchProducts(
            @RequestParam String keyword) {

        return productService.searchProducts(keyword);
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductResponse> getProductsByCategory(
            @PathVariable UUID categoryId) {

        return productService
                .getProductsByCategory(categoryId);
    }

    @GetMapping("/all")
    public List<ProductResponse> getAllProductsWithoutPagination() {

        return productService
                .getAllProductsWithoutPagination();
    }
}
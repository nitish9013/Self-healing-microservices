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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        log.info(
                "Creating product: name={}, categoryId={}",
                request.getName(),
                request.getCategoryId()
        );

        try {

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

            log.info(
                    "Product created successfully: productId={}, categoryId={}",
                    savedProduct.getId(),
                    category.getId()
            );

            return mapToResponse(savedProduct);

        } catch (Exception ex) {

            log.error(
                    "Failed to create product: name={}, categoryId={}, error={}",
                    request.getName(),
                    request.getCategoryId(),
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    @Override
    public ProductResponse getProductById(UUID productId) {

        log.debug("Fetching product: productId={}", productId);

        try {

            Product product = productRepository
                    .findById(productId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product not found"));

            log.debug(
                    "Product fetched successfully: productId={}",
                    productId
            );

            return mapToResponse(product);

        } catch (Exception ex) {

            log.warn(
                    "Failed to fetch product: productId={}, error={}",
                    productId,
                    ex.getMessage()
            );

            throw ex;
        }
    }

    @Override
    public Page<ProductResponse> getAllProducts(
            int page,
            int size) {

        log.debug(
                "Fetching products with pagination: page={}, size={}",
                page,
                size
        );

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("createdAt")
                                .descending());

        Page<ProductResponse> products =
                productRepository
                        .findAll(pageable)
                        .map(this::mapToResponse);

        log.info(
                "Products fetched successfully: page={}, size={}, totalElements={}",
                page,
                size,
                products.getTotalElements()
        );

        return products;
    }

    @Override
    public ProductResponse updateProduct(
            UUID productId,
            ProductRequest request) {

        log.info(
                "Updating product: productId={}, categoryId={}",
                productId,
                request.getCategoryId()
        );

        try {

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

            log.info(
                    "Product updated successfully: productId={}",
                    productId
            );

            return mapToResponse(updatedProduct);

        } catch (Exception ex) {

            log.error(
                    "Failed to update product: productId={}, error={}",
                    productId,
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    @Override
    public void deleteProduct(UUID productId) {

        log.info(
                "Deleting product: productId={}",
                productId
        );

        try {

            Product product = productRepository
                    .findById(productId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product not found"));

            productRepository.delete(product);

            log.info(
                    "Product deleted successfully: productId={}",
                    productId
            );

        } catch (Exception ex) {

            log.error(
                    "Failed to delete product: productId={}, error={}",
                    productId,
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    @Override
    public List<ProductResponse> searchProducts(
            String keyword) {

        log.info(
                "Searching products: keyword={}",
                keyword
        );

        try {

            List<ProductResponse> products =
                    productRepository
                            .findByNameContainingIgnoreCase(keyword)
                            .stream()
                            .map(this::mapToResponse)
                            .toList();

            log.info(
                    "Product search completed: keyword={}, resultCount={}",
                    keyword,
                    products.size()
            );

            return products;

        } catch (Exception ex) {

            log.error(
                    "Product search failed: keyword={}, error={}",
                    keyword,
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    @Override
    public List<ProductResponse>
    getProductsByCategory(UUID categoryId) {

        log.info(
                "Fetching products by category: categoryId={}",
                categoryId
        );

        try {

            List<ProductResponse> products =
                    productRepository
                            .findByCategory_Id(categoryId)
                            .stream()
                            .map(this::mapToResponse)
                            .toList();

            log.info(
                    "Products fetched by category: categoryId={}, resultCount={}",
                    categoryId,
                    products.size()
            );

            return products;

        } catch (Exception ex) {

            log.error(
                    "Failed to fetch products by category: categoryId={}, error={}",
                    categoryId,
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
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

        log.debug("Fetching all products without pagination");

        try {

            List<ProductResponse> products =
                    productRepository
                            .findAll()
                            .stream()
                            .map(this::mapToResponse)
                            .toList();

            log.info(
                    "All products fetched: resultCount={}",
                    products.size()
            );

            return products;

        } catch (Exception ex) {

            log.error(
                    "Failed to fetch all products: error={}",
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    @Override
    public Long getTotalProducts() {

        log.debug("Fetching total product count");

        Long count = productRepository.count();

        log.info(
                "Total product count retrieved: count={}",
                count
        );

        return count;
    }
}
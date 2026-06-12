package com.ecommerce.catalog.service;

import com.ecommerce.catalog.dto.request.CategoryRequest;
import com.ecommerce.catalog.dto.response.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {

    CategoryResponse createCategory(
            CategoryRequest request);

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(
            UUID categoryId);

    CategoryResponse updateCategory(
            UUID categoryId,
            CategoryRequest request);

    void deleteCategory(
            UUID categoryId);
}
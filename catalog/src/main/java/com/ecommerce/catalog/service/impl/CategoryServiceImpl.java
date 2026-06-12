package com.ecommerce.catalog.service.impl;

import com.ecommerce.catalog.dto.request.CategoryRequest;
import com.ecommerce.catalog.dto.response.CategoryResponse;
import com.ecommerce.catalog.entity.Category;
import com.ecommerce.catalog.exception.DuplicateResourceException;
import com.ecommerce.catalog.exception.ResourceNotFoundException;
import com.ecommerce.catalog.repository.CategoryRepository;
import com.ecommerce.catalog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl
        implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(
            CategoryRequest request) {

        if(categoryRepository
                .existsByNameIgnoreCase(
                        request.getName())) {

            throw new DuplicateResourceException(
                    "Category already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(
                        request.getDescription())
                .build();

        Category savedCategory =
                categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Override
    public List<CategoryResponse>
    getAllCategories() {

        return categoryRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(
            UUID categoryId) {

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"));

        return mapToResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(
            UUID categoryId,
            CategoryRequest request) {

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"));

        category.setName(request.getName());
        category.setDescription(
                request.getDescription());

        Category updatedCategory =
                categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(
            UUID categoryId) {

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"));

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(
            Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(
                        category.getDescription())
                .createdAt(
                        category.getCreatedAt())
                .updatedAt(
                        category.getUpdatedAt())
                .build();
    }
}
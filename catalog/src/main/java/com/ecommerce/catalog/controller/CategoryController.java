package com.ecommerce.catalog.controller;

import com.ecommerce.catalog.dto.request.CategoryRequest;
import com.ecommerce.catalog.dto.response.CategoryResponse;
import com.ecommerce.catalog.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public CategoryResponse createCategory(
            @Valid
            @RequestBody CategoryRequest request) {

        return categoryService.createCategory(request);
    }

    @GetMapping
    public List<CategoryResponse> getAllCategories() {

        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public CategoryResponse getCategoryById(
            @PathVariable UUID id) {

        return categoryService.getCategoryById(id);
    }

    @PutMapping("/{id}")
    public CategoryResponse updateCategory(

            @PathVariable UUID id,

            @Valid
            @RequestBody CategoryRequest request) {

        return categoryService
                .updateCategory(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(
            @PathVariable UUID id) {

        categoryService.deleteCategory(id);
    }
}
package com.ecommerce.catalog.repository;

import com.ecommerce.catalog.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository
        extends JpaRepository<Category, UUID> {

    Optional<Category> findByNameIgnoreCase(
            String name);

    boolean existsByNameIgnoreCase(
            String name);
}
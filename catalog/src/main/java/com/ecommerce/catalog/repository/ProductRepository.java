package com.ecommerce.catalog.repository;

import com.ecommerce.catalog.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductRepository
        extends JpaRepository<Product, UUID> {

    List<Product> findByNameContainingIgnoreCase(
            String keyword);

    List<Product> findByCategory_Id(
            UUID categoryId);

    Page<Product> findAll(Pageable pageable);
}
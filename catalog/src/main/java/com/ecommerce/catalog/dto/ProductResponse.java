package com.ecommerce.catalog.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {

    private UUID id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stockQuantity;

    private String imageUrl;

    private Boolean active;

    private UUID categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
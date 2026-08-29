package com.orderservice.order.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "orders",
        indexes = {
                @Index(name = "idx_order_username", columnList = "username"),
                @Index(name = "idx_order_status", columnList = "status"),
                @Index(name = "idx_order_product_id", columnList = "product_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Product ID from Catalog Service.
     *
     * We intentionally store the ID instead of creating
     * a JPA relationship with Catalog Service because
     * Catalog is a separate microservice.
     */
    @Column(name = "product_id", nullable = false)
    private String productId;

    /**
     * Snapshot of product name at order creation time.
     */
    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private int quantity;

    /**
     * Snapshot of product price at order creation time.
     */
    @Column(nullable = false)
    private double price;

    /**
     * Username extracted from authenticated request.
     */
    @Column(nullable = false)
    private String username;

    /**
     * PENDING → PAID / FAILED
     */
    @Column(nullable = false)
    private String status;
}
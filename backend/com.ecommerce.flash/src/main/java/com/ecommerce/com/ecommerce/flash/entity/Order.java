package com.ecommerce.com.ecommerce.flash.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Many orders can reference one product
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    // Many orders can reference one user (customer)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Status of the order: PENDING, ACCEPTED, REJECTED
    @Column(nullable = false)
    private String status = "PENDING";
    
    // Order placed date/time
    @Column(nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();
    
    // You can add quantity, delivery details, etc.
}

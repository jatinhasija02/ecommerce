package com.ecommerce.com.ecommerce.flash.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ecommerce.com.ecommerce.flash.entity.Order;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Retrieve orders by user
    List<Order> findByUserId(Long userId);
    
    // Retrieve orders for products owned by a specific product owner
    List<Order> findByProductProductOwnerProductOwnerId(Long productOwnerId);
}

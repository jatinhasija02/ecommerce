package com.ecommerce.com.ecommerce.flash.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ecommerce.com.ecommerce.flash.entity.Product;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
 // Custom query to fetch products by product owner ID
    @Query("SELECT p FROM Product p WHERE p.productOwner.id = :ownerId")
    List<Product> findProductsByProductOwnerId(Long ownerId);
    List<Product> findByProductOwner_ProductOwnerId(Long ownerId);
    List<Product> findByApproved(boolean approved);

}

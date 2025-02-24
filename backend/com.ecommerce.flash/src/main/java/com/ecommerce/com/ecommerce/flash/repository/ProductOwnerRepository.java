package com.ecommerce.com.ecommerce.flash.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.com.ecommerce.flash.entity.Product;
import com.ecommerce.com.ecommerce.flash.entity.ProductOwner;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductOwnerRepository extends JpaRepository<ProductOwner, Long> {
    Optional<ProductOwner> findByProductOwnerEmail(String productOwnerEmail);



}
package com.ecommerce.com.ecommerce.flash.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.com.ecommerce.flash.entity.Admin;
@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Optionally, add custom query methods if needed
    Admin findByAdminEmail(String adminEmail);
}

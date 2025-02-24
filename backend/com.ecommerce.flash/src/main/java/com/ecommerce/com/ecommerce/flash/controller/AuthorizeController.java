package com.ecommerce.com.ecommerce.flash.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.com.ecommerce.flash.dao.AdminDao;
import com.ecommerce.com.ecommerce.flash.dao.ProductOwnerDao;
import com.ecommerce.com.ecommerce.flash.dao.UserDao;
import com.ecommerce.com.ecommerce.flash.entity.Admin;
import com.ecommerce.com.ecommerce.flash.entity.ProductOwner;
import com.ecommerce.com.ecommerce.flash.entity.User;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthorizeController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductOwnerDao productOwnerDao;
    
    @Autowired
    private AdminDao adminDao; // Make sure AdminDao is annotated with @Repository (or @Component)

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // Check if it's a normal user
        Optional<User> user = userDao.getUserByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "USER");
            response.put("id", user.get().getId());
            response.put("message", "User login successful");
            return ResponseEntity.ok(response);
        }

        // Check if it's a product owner
        Optional<ProductOwner> productOwner = productOwnerDao.getProductOwnerByEmail(email);
        if (productOwner.isPresent() && productOwner.get().getProductOwnerPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "PRODUCT_OWNER");
            response.put("id", productOwner.get().getProductOwnerId());
            response.put("message", "Product Owner login successful");
            return ResponseEntity.ok(response);
        }
        
        // Check if it's an admin
        Optional<Admin> admin = Optional.ofNullable(adminDao.findByEmailAdmin(email));
        if (admin.isPresent() && admin.get().getAdminPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "ADMIN");
            response.put("id", admin.get().getAdminId());
            response.put("message", "Admin login successful");
            return ResponseEntity.ok(response);
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}

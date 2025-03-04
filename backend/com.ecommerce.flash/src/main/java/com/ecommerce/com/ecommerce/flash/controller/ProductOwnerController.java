package com.ecommerce.com.ecommerce.flash.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.com.ecommerce.flash.dao.ProductOwnerDao;
import com.ecommerce.com.ecommerce.flash.entity.ProductOwner;
import com.ecommerce.com.ecommerce.flash.repository.ProductOwnerRepository;
import com.ecommerce.com.ecommerce.flash.repository.ProductRepository;

import jakarta.validation.Valid;

@CrossOrigin(origins = {"http://localhost:5174","http://localhost:5173"}, allowCredentials = "true")
@RestController
@RequestMapping("/product-owners")
public class ProductOwnerController {

    @Autowired
    private ProductOwnerDao productOwnerDao;

    @Autowired
    private ProductOwnerRepository productOwnerRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/{email:.+@.+\\..+}") // Regex to match email format
    public ResponseEntity<?> getProductOwnerByEmail(@PathVariable String email) {
        Optional<ProductOwner> productOwner = productOwnerDao.getProductOwnerByEmail(email);
        return productOwner.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerProductOwner(@Valid @RequestBody ProductOwner productOwner) {
        try {
            ProductOwner savedOwner = productOwnerRepository.save(productOwner);
            return ResponseEntity.ok(savedOwner);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering product owner: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductOwner>> getAllProductOwners() {
        List<ProductOwner> owners = productOwnerRepository.findAll();
        return ResponseEntity.ok(owners);
    }

    @GetMapping("/{ownerId}")
    public ResponseEntity<ProductOwner> getProductOwnerById(@PathVariable Long ownerId) {
        Optional<ProductOwner> owner = productOwnerRepository.findById(ownerId);
        return owner.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProductOwner(@PathVariable Long id,
                                                @RequestBody ProductOwner updatedOwner) {
        Optional<ProductOwner> existingOwner = productOwnerRepository.findById(id);

        if (existingOwner.isPresent()) {
            ProductOwner owner = existingOwner.get();
            owner.setProductOwnerName(updatedOwner.getProductOwnerName());
            owner.setProductOwnerNumber(updatedOwner.getProductOwnerNumber());
            productOwnerRepository.save(owner);
            return ResponseEntity.ok("Product owner updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Product owner not found.");
        }
    }
}

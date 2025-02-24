package com.ecommerce.com.ecommerce.flash.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.com.ecommerce.flash.dao.ProductDao;
import com.ecommerce.com.ecommerce.flash.entity.Product;
import com.ecommerce.com.ecommerce.flash.entity.ProductOwner;
import com.ecommerce.com.ecommerce.flash.repository.ProductOwnerRepository;
import com.ecommerce.com.ecommerce.flash.repository.ProductRepository;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private ProductOwnerRepository productOwnerRepository;

    @Autowired
    private ProductRepository productRepository;
    
    // DTO for Product Data Transfer
    public static class ProductDTO {
        private Long id;
        private String name;
        private String description;
        private double price;
        private int stock;
        private String category;
        private boolean available;
        private List<String> productSizes;
        private List<String> productColors;
        private String productImageBase64;
        private ProductOwner productOwner;
        private boolean approved;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public int getStock() { return stock; }
        public void setStock(int stock) { this.stock = stock; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }
        public List<String> getProductSizes() { return productSizes; }
        public void setProductSizes(List<String> productSizes) { this.productSizes = productSizes; }
        public List<String> getProductColors() { return productColors; }
        public void setProductColors(List<String> productColors) { this.productColors = productColors; }
        public String getProductImageBase64() { return productImageBase64; }
        public void setProductImageBase64(String productImageBase64) { this.productImageBase64 = productImageBase64; }
        public ProductOwner getProductOwner() { return productOwner; }
        public void setProductOwner(ProductOwner productOwner) { this.productOwner = productOwner; }
        public boolean isApproved() { return approved; }
        public void setApproved(boolean approved) { this.approved = approved; }
    }
    
    // Convert Product -> ProductDTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setCategory(product.getCategory());
        dto.setAvailable(product.isAvailable());
        dto.setProductSizes(product.getProductSizes());
        dto.setProductColors(product.getProductColors());
        dto.setProductOwner(product.getProductOwner());
        dto.setApproved(product.isApproved());
        if (product.getProductImage() != null) {
            dto.setProductImageBase64(Base64.getEncoder().encodeToString(product.getProductImage()));
        }
        return dto;
    }
    
    // Fetch All Products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<Product> products = productDao.getAllProducts();
        List<ProductDTO> productDTOs = products.stream()
                                               .map(this::convertToDTO)
                                               .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }
    
    // Fetch Product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> optionalProduct = productDao.getProductById(id);
        if (optionalProduct.isPresent()) {
            return ResponseEntity.ok(convertToDTO(optionalProduct.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }
    
    // Fetch Approved Products
    @GetMapping("/approved")
    public ResponseEntity<List<ProductDTO>> getApprovedProducts() {
        List<Product> approvedProducts = productRepository.findByApproved(true);
        List<ProductDTO> productDTOs = approvedProducts.stream()
                                                       .map(this::convertToDTO)
                                                       .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }
    
    // Approve a Product
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProduct(@PathVariable Long id) {
        Optional<Product> optionalProduct = productDao.getProductById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setApproved(true);
            productDao.saveProduct(product);
            return ResponseEntity.ok("Product approved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }
    
    // Delete a Product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Optional<Product> prodOpt = productDao.getProductById(id);
            if (prodOpt.isPresent()) {
                Product product = prodOpt.get();
                if (product.getProductSizes() != null) {
                    product.getProductSizes().clear();
                }
                if (product.getProductColors() != null) {
                    product.getProductColors().clear();
                }
                productDao.saveProduct(product);
                productDao.deleteProduct(id);
                return ResponseEntity.ok("Product deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting product.");
        }
    }
    
    // Add Product (multipart/form-data)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("price") double price,
        @RequestParam("stock") int stock,
        @RequestParam("category") String category,
        @RequestParam("productOwnerId") Long productOwnerId,
        @RequestParam("productSizes") String productSizes,    // Comma-separated sizes
        @RequestParam("productColors") String productColors,  // Comma-separated colors
        @RequestParam("available") boolean available,
        @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);
            product.setCategory(category);
            product.setAvailable(available);
            
            if (productSizes != null && !productSizes.isEmpty()) {
                List<String> sizes = Arrays.asList(productSizes.split(","));
                product.setProductSizes(sizes);
            } else {
                product.setProductSizes(Collections.emptyList());
            }
            if (productColors != null && !productColors.isEmpty()) {
                List<String> colors = Arrays.asList(productColors.split(","));
                product.setProductColors(colors);
            } else {
                product.setProductColors(Collections.emptyList());
            }
            
            if (images != null && !images.isEmpty()) {
                MultipartFile file = images.get(0);
                product.setProductImage(file.getBytes());
            }
            
            Optional<ProductOwner> optOwner = productOwnerRepository.findById(productOwnerId);
            if (!optOwner.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid product owner ID");
            }
            product.setProductOwner(optOwner.get());
            
            Product savedProduct = productDao.saveProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image file.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding product: " + e.getMessage());
        }
    }
    
    // NEW: Fetch Products by Owner ID
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getProductsByOwner(@PathVariable Long ownerId) {
        List<Product> products = productDao.getProductsByOwnerId(ownerId);
        return ResponseEntity.ok(products);
    }
}

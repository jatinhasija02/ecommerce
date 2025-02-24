package com.ecommerce.com.ecommerce.flash.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.com.ecommerce.flash.entity.Product;
import com.ecommerce.com.ecommerce.flash.repository.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductDao {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        System.out.println("DAO: Retrieved " + products.size() + " products from repository");
        return products;
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public List<Product> getProductsByOwnerId(Long ownerId) {
        return productRepository.findProductsByProductOwnerId(ownerId);
    }
}

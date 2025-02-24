package com.ecommerce.com.ecommerce.flash.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.com.ecommerce.flash.entity.ProductOwner;
import com.ecommerce.com.ecommerce.flash.repository.ProductOwnerRepository;

import java.util.Optional;

@Service
public class ProductOwnerDao {
	@Autowired
	private ProductOwnerRepository productOwnerRepository;

	public Optional<ProductOwner> getProductOwnerByEmail(String email) {
		return productOwnerRepository.findByProductOwnerEmail(email);
	}

	public ProductOwner saveProductOwner(ProductOwner productOwner) {
		return productOwnerRepository.save(productOwner);
	}
}

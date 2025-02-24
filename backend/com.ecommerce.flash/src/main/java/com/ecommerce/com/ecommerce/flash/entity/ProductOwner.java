package com.ecommerce.com.ecommerce.flash.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_owner_id")
    private Long productOwnerId;
    
    @NotBlank(message = "Product owner name is required")
    @JsonProperty("productOwnerName")
    @Column(name = "product_owner_name", nullable = false)
    private String productOwnerName;
    
    @NotBlank(message = "Product owner email is required")
    @JsonProperty("productOwnerEmail")
    @Column(name = "product_owner_email", nullable = false, unique = true)
    private String productOwnerEmail;
    
    @NotBlank(message = "Product owner password is required")
    @JsonProperty("productOwnerPassword")
    @Column(name = "product_owner_password", nullable = false)
    private String productOwnerPassword;
    
    @NotNull(message = "Product owner number is required")
    @JsonProperty("productOwnerNumber")
    @Column(name = "product_owner_number", nullable = false, unique = true)
    private long productOwnerNumber;
    
    // A ProductOwner can have multiple products
    @OneToMany(mappedBy = "productOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Product> products;
}

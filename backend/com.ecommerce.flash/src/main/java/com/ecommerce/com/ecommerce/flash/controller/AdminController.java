package com.ecommerce.com.ecommerce.flash.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.com.ecommerce.flash.dao.AdminDao;
import com.ecommerce.com.ecommerce.flash.entity.Admin;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminDao adminDao;

    // Create a new admin
    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        Admin savedAdmin = adminDao.createAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    // Get all admins
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminDao.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    // Get admin by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        Optional<Admin> adminOpt = adminDao.getAdminById(id);
        if (adminOpt.isPresent()) {
            return ResponseEntity.ok(adminOpt.get());
        } else {
            return ResponseEntity.status(404).body("Admin not found with id: " + id);
        }
    }

    // Update admin by id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin adminDetails) {
        Admin updatedAdmin = adminDao.updateAdmin(id, adminDetails);
        if (updatedAdmin != null) {
            return ResponseEntity.ok(updatedAdmin);
        } else {
            return ResponseEntity.status(404).body("Admin not found with id: " + id);
        }
    }

    // Delete admin by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        Optional<Admin> adminOpt = adminDao.getAdminById(id);
        if (adminOpt.isPresent()) {
            adminDao.deleteAdmin(id);
            return ResponseEntity.ok("Admin deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Admin not found with id: " + id);
        }
    }
}

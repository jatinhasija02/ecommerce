package com.ecommerce.com.ecommerce.flash.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.com.ecommerce.flash.entity.Admin;
import com.ecommerce.com.ecommerce.flash.repository.AdminRepository;
@Service
public class AdminDao {
	
	@Autowired
    private AdminRepository adminRepository;
    
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin updateAdmin(Long id, Admin adminDetails) {
        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if(optionalAdmin.isPresent()){
            Admin admin = optionalAdmin.get();
            admin.setAdminName(adminDetails.getAdminName());
            admin.setAdminEmail(adminDetails.getAdminEmail());
            admin.setAdminPassword(adminDetails.getAdminPassword());
            return adminRepository.save(admin);
        }
        return null;
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
    public Admin findByEmailAdmin(String email) {
        return adminRepository.findByAdminEmail(email);
    }
}


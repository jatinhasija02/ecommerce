package com.ecommerce.com.ecommerce.flash.dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.com.ecommerce.flash.entity.User;
import com.ecommerce.com.ecommerce.flash.repository.UserRepository;

import java.util.Optional;

@Service
public class UserDao {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }
}

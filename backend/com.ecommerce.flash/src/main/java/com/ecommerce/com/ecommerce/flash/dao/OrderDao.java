package com.ecommerce.com.ecommerce.flash.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.com.ecommerce.flash.entity.Order;
import com.ecommerce.com.ecommerce.flash.repository.OrderRepository;
import java.util.List;
import java.util.Optional;

@Service
public class OrderDao {

    @Autowired
    private OrderRepository orderRepository;

    public Order placeOrder(Order order) {
        return orderRepository.save(order);
    }
    
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    public List<Order> getOrdersByProductOwnerId(Long productOwnerId) {
        return orderRepository.findByProductProductOwnerProductOwnerId(productOwnerId);
    }
    
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }
 // Delete an order by its ID
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

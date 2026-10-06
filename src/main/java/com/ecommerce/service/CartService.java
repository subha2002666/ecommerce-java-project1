package com.ecommerce.service;

import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartRepository, UserRepository userRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public CartItem add(Long userId, Long productId, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be at least 1");

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem item = cartRepository.findByUserIdAndProductId(userId, productId)
            .orElse(new CartItem(user, product, 0));

        int newQuantity = item.getQuantity() + quantity;
        if (newQuantity > product.getStock()) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        item.setQuantity(newQuantity);
        return cartRepository.save(item);
    }

    public CartItem update(Long itemId, int quantity) {
        CartItem item = cartRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity < 1 || quantity > item.getProduct().getStock()) {
            throw new IllegalArgumentException("Invalid quantity");
        }

        item.setQuantity(quantity);
        return cartRepository.save(item);
    }

    public void remove(Long itemId) {
        cartRepository.deleteById(itemId);
    }

    @Transactional
    public void clear(Long userId) {
        cartRepository.deleteAll(cartRepository.findByUserId(userId));
    }
}

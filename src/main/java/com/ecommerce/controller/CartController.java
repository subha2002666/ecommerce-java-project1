package com.ecommerce.controller;

import com.ecommerce.entity.CartItem;
import com.ecommerce.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/{userId}/add")
    public CartItem add(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> body) {

        Long productId = body.get("productId").longValue();
        int quantity = body.getOrDefault("quantity", 1);

        return cartService.add(userId, productId, quantity);
    }

    @PutMapping("/item/{itemId}")
    public CartItem update(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body) {

        int quantity = body.get("quantity");

        return cartService.update(itemId, quantity);
    }

    @DeleteMapping("/item/{itemId}")
    public void remove(@PathVariable Long itemId) {
        cartService.remove(itemId);
    }
}
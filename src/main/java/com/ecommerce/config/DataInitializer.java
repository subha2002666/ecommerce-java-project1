package com.ecommerce.config;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UserRepository users, ProductRepository products,
                               PasswordEncoder encoder) {
        return args -> {
            if (users.findByEmail("admin@shop.com").isEmpty()) {
                users.save(new User(
                    "Administrator",
                    "admin@shop.com",
                    encoder.encode("admin123"),
                    "ADMIN"
                ));
            }

            if (products.count() == 0) {
                products.save(new Product(
                    "Wireless Headphones",
                    "Bluetooth over-ear headphones with clear sound.",
                    2499,
                    25,
                    "Electronics",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
                ));

                products.save(new Product(
                    "Smart Watch",
                    "Fitness and notification smart watch.",
                    3999,
                    18,
                    "Electronics",
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
                ));

                products.save(new Product(
                    "Running Shoes",
                    "Comfortable everyday running shoes.",
                    2999,
                    30,
                    "Fashion",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
                ));

                products.save(new Product(
                    "Backpack",
                    "Water-resistant laptop backpack.",
                    1599,
                    20,
                    "Accessories",
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
                ));
            }
        };
    }
}

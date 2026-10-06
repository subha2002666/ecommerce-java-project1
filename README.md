# E-Commerce Full Stack Project

A beginner-friendly full-stack e-commerce application built with:

- Java 21
- Spring Boot 4.0.7
- Spring Data JPA / Hibernate
- Spring Security
- MySQL
- HTML, CSS, JavaScript
- REST APIs

## Features

### Customer
- View products
- Search products
- Add products to cart
- Update cart quantity
- Remove cart items
- Checkout
- View orders
- Register and login

### Admin
- Add products
- Update products
- Delete products
- View all orders
- Update order status

## Project structure

```text
ecommerce
├── pom.xml
├── README.md
└── src
    └── main
        ├── java/com/ecommerce
        │   ├── config
        │   ├── controller
        │   ├── dto
        │   ├── entity
        │   ├── exception
        │   ├── repository
        │   └── service
        └── resources
            ├── application.properties
            └── static
                ├── index.html
                ├── login.html
                ├── register.html
                ├── cart.html
                ├── orders.html
                ├── admin.html
                ├── css/style.css
                └── js/app.js
```

## 1. Create the database

Open MySQL and run:

```sql
CREATE DATABASE ecommerce_db;
```

## 2. Configure MySQL

Open:

`src/main/resources/application.properties`

Change:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

If your MySQL password is empty, use:

```properties
spring.datasource.password=
```

## 3. Run

From the project folder:

```bash
mvn spring-boot:run
```

Or run `EcommerceApplication.java` from VS Code.

Open:

```text
http://localhost:8080
```

## Default admin

The application creates an admin account on first startup:

```text
Email: admin@shop.com
Password: admin123
```

Change this password before using the project publicly.

## Important learning flow

```text
Browser
   ↓
JavaScript fetch()
   ↓
REST Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL
```

The project is intentionally kept as a modular monolith so a beginner can understand the complete request flow before learning microservices.

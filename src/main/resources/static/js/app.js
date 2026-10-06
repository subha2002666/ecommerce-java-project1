const user = () => JSON.parse(localStorage.getItem("user") || "null");

async function loadProducts() {
    const search = document.getElementById("search")?.value || "";
    const category = document.getElementById("category")?.value || "";
    const response = await fetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
    const products = await response.json();
    const box = document.getElementById("products");
    if (!box) return;
    box.innerHTML = products.map(p => `
        <article class="card">
            <img src="${p.imageUrl || 'https://via.placeholder.com/600x400?text=Product'}" alt="${p.name}">
            <div class="card-body">
                <p class="muted">${p.category || 'General'}</p>
                <h3>${p.name}</h3>
                <p class="muted">${p.description || ''}</p>
                <div class="price">₹${Number(p.price).toLocaleString('en-IN')}</div>
                <p class="muted">Stock: ${p.stock}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </article>
    `).join("");
}

async function addToCart(productId) {
    const current = user();
    if (!current) {
        location.href = "/login.html";
        return;
    }

    const response = await fetch(`/api/cart/${current.id}/add`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({productId, quantity:1})
    });

    const data = await response.json();
    if (!response.ok) {
        alert(data.message || "Could not add product");
        return;
    }
    alert("Added to cart");
    updateCartCount();
}

async function updateCartCount() {
    const current = user();
    const count = document.getElementById("cartCount");
    if (!count || !current) return;
    const response = await fetch(`/api/cart/${current.id}`);
    if (!response.ok) return;
    const items = await response.json();
    count.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
}

async function loadCart() {
    const current = user();
    const box = document.getElementById("cart");
    if (!current) {
        box.innerHTML = '<p>Please <a href="/login.html">login</a> to view your cart.</p>';
        return;
    }

    const response = await fetch(`/api/cart/${current.id}`);
    const items = await response.json();

    if (!items.length) {
        box.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("checkout").style.display = "none";
        return;
    }

    let total = 0;
    box.innerHTML = items.map(item => {
        const line = item.product.price * item.quantity;
        total += line;
        return `
        <div class="cart-row">
            <div>
                <strong>${item.product.name}</strong>
                <div class="muted">₹${item.product.price} × ${item.quantity}</div>
            </div>
            <div>
                <strong>₹${line.toLocaleString('en-IN')}</strong>
                <button onclick="removeCartItem(${item.id})">Remove</button>
            </div>
        </div>`;
    }).join("");

    document.getElementById("cartTotal").textContent = `Total: ₹${total.toLocaleString('en-IN')}`;
}

async function removeCartItem(id) {
    await fetch(`/api/cart/item/${id}`, {method:"DELETE"});
    loadCart();
    updateCartCount();
}

async function checkout() {
    const current = user();
    if (!current) return location.href = "/login.html";

    const response = await fetch(`/api/orders/checkout/${current.id}`, {method:"POST"});
    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Checkout failed");
        return;
    }

    alert(`Order #${data.id} placed successfully!`);
    location.href = "/orders.html";
}

async function loadOrders() {
    const current = user();
    const box = document.getElementById("orders");

    if (!current) {
        box.innerHTML = '<p>Please <a href="/login.html">login</a> to view orders.</p>';
        return;
    }

    const response = await fetch(`/api/orders/user/${current.id}`);
    const orders = await response.json();

    if (!orders.length) {
        box.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    box.innerHTML = orders.map(order => `
        <div class="order">
            <div>
                <strong>Order #${order.id}</strong>
                <p class="muted">${new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
                <strong>₹${Number(order.totalAmount).toLocaleString('en-IN')}</strong>
                <span class="status">${order.status}</span>
            </div>
        </div>
    `).join("");
}

async function loadAdminProducts() {
    const box = document.getElementById("adminProducts");
    if (!box) return;

    const response = await fetch("/api/products");
    const products = await response.json();

    box.innerHTML = products.map(p => `
        <article class="card">
            <img src="${p.imageUrl || 'https://via.placeholder.com/600x400?text=Product'}">
            <div class="card-body">
                <h3>${p.name}</h3>
                <p>₹${p.price} | Stock: ${p.stock}</p>
                <button onclick="deleteProduct(${p.id})">Delete</button>
            </div>
        </article>
    `).join("");
}

async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    const response = await fetch(`/api/products/${id}`, {method:"DELETE"});
    if (response.ok) loadAdminProducts();
    else alert("Could not delete product");
}

const productForm = document.getElementById("productForm");
if (productForm) {
    productForm.addEventListener("submit", async e => {
        e.preventDefault();

        const response = await fetch("/api/products", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                name: document.getElementById("pname").value,
                price: Number(document.getElementById("price").value),
                stock: Number(document.getElementById("stock").value),
                category: document.getElementById("category").value,
                imageUrl: document.getElementById("imageUrl").value,
                description: document.getElementById("description").value
            })
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.message || "Could not create product");
            return;
        }

        productForm.reset();
        loadAdminProducts();
        alert("Product added");
    });
}

loadProducts();
updateCartCount();


const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Laptop Backpack",
        price: 999,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    }
];

// Display products
let cart = [];

const productContainer =
    document.getElementById("productContainer");

function displayProducts(items) {

    productContainer.innerHTML = "";

    items.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.alt='Image unavailable'; this.style.display='none';"
            >

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

            <a href="product-details.html?id=${product.id}">
                View Details
            </a>

            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productContainer.appendChild(card);
    });
}

// Add product to cart
function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Product added successfully!");
}

// Update cart count
function updateCartCount() {

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Search products
const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const searchValue =
            this.value.toLowerCase();

        const filteredProducts = products.filter(
            product =>
                product.name.toLowerCase().includes(searchValue)
        );

        displayProducts(filteredProducts);
    });
}

// Initial display
displayProducts(products);

// Initial cart count
updateCartCount();

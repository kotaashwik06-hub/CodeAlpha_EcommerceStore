
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        image: "https://placehold.co/400x300?text=Headphones",
        description: "Enjoy high-quality sound with comfortable wireless headphones. Perfect for music, gaming and online meetings."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1999,
        image: "https://placehold.co/400x300?text=Smart+Watch",
        description: "A stylish smartwatch with fitness tracking, notifications and a modern design."
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 2499,
        image: "https://placehold.co/400x300?text=Shoes",
        description: "Comfortable and lightweight running shoes designed for everyday use and exercise."
    },
    {
        id: 4,
        name: "Laptop Backpack",
        price: 999,
        image: "https://placehold.co/400x300?text=Backpack",
        description: "A spacious and durable backpack designed to carry laptops and daily essentials."
    }
];


const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

const product = products.find(item => item.id === productId);

const detailsContainer =
    document.getElementById("productDetails");


if (product) {

    detailsContainer.innerHTML = `
        <div class="details-card">

            <img src="${product.image}"
                 alt="${product.name}">

            <div class="details-info">

                <h2>${product.name}</h2>

                <h3>₹${product.price}</h3>

                <p>${product.description}</p>

                <label for="quantity">Quantity:</label>

                <input
                    type="number"
                    id="quantity"
                    value="1"
                    min="1"
                    max="10"
                >

                <button id="addDetailsCart">
                    Add to Cart
                </button>

                <a href="index.html">
                    Back to Products
                </a>

            </div>
        </div>
    `;

    document.getElementById("addDetailsCart")
        .addEventListener("click", function() {

            const quantity = Number(
                document.getElementById("quantity").value
            );

            if (!Number.isInteger(quantity) ||
                quantity < 1 || quantity > 10) {
                alert("Please select a quantity between 1 and 10.");
                return;
            }

            let cart = JSON.parse(
                localStorage.getItem("cart")
            ) || [];

            const existingItem = cart.find(
                item => item.id === product.id
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    ...product,
                    quantity: quantity
                });
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            alert("Product added to cart successfully!");

        });

} else {

    detailsContainer.innerHTML =
        "<h2>Product not found!</h2><a href='index.html'>Go Home</a>";
}

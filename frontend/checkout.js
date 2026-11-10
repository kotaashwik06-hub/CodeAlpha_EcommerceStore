
const API_URL = "http://localhost:5001/api/orders";

// Get cart products
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Get logged-in user information
const userData = localStorage.getItem("user");

if (userData) {
    try {
        const user = JSON.parse(userData);

        document.getElementById("customerName").value =
            user.name || "";

        document.getElementById("customerEmail").value =
            user.email || "";

    } catch (error) {
        console.error("Unable to read user information:", error);
    }
}

// Display checkout products
function displayCheckout() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");

    checkoutItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        checkoutItems.textContent = "Your cart is empty.";
        checkoutTotal.textContent = "₹0";

        placeOrderBtn.disabled = true;
        return;
    }

    cart.forEach(item => {

        const itemTotal =
            Number(item.price) * Number(item.quantity);

        total += itemTotal;

        const div = document.createElement("div");

        div.className = "checkout-item";

        div.textContent =
            `${item.name} × ${item.quantity} - ₹${itemTotal}`;

        checkoutItems.appendChild(div);
    });

    checkoutTotal.textContent = `₹${total}`;
}

// Place order
const checkoutForm =
    document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login before placing an order.");
        window.location.href = "login.html";
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const customer = {

        name: document.getElementById("customerName").value.trim(),

        email: document.getElementById("customerEmail").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        address: document.getElementById("address").value.trim(),

        city: document.getElementById("city").value.trim(),

        pincode: document.getElementById("pincode").value.trim()
    };

    if (!customer.name || !customer.email ||
        !customer.address || !customer.city) {

        alert("Please fill in all required details.");
        return;
    }

    if (!/^[0-9]{10}$/.test(customer.phone)) {
        alert("Enter a valid 10-digit phone number.");
        return;
    }

    if (!/^[0-9]{6}$/.test(customer.pincode)) {
        alert("Enter a valid 6-digit PIN code.");
        return;
    }

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing Order...";

    try {

        // Send order to backend
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                customer: customer,
                items: cart
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Order placement failed."
            );
        }

        // Save returned order details for success page
        localStorage.setItem(
            "lastOrderId",
            data.order.orderId
        );

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(data.order)
        );

        // Clear cart after successful database save
        localStorage.removeItem("cart");

        // Redirect to success page
        window.location.href = "order-success.html";

    } catch (error) {

        alert(error.message);

        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Place Order";

        console.error("Order error:", error);
    }
});

// Display checkout
displayCheckout();

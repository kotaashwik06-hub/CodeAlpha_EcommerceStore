
const API_URL = "http://localhost:5001/api/orders/my-orders";

// Get login token
const ordersToken = localStorage.getItem("token");

const ordersMessage = document.getElementById("ordersMessage");
const ordersList = document.getElementById("ordersList");

// Check whether customer is logged in
if (!ordersToken) {
    alert("Please login to view your orders.");
    window.location.href = "login.html";
} else {
    loadMyOrders();
}

// Fetch orders from MongoDB
async function loadMyOrders() {
    try {
        ordersMessage.textContent = "Loading your orders...";

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ordersToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load orders.");
        }

        ordersList.replaceChildren();

        if (!data.orders || data.orders.length === 0) {
            ordersMessage.textContent = "You have not placed any orders yet.";
            return;
        }

        ordersMessage.textContent = `You have placed ${data.orders.length} order(s).`;

        data.orders.forEach(order => {
            displayOrder(order);
        });

    } catch (error) {
        ordersMessage.textContent = error.message;
        console.error("My Orders Error:", error);
    }
}

// Display one order
function displayOrder(order) {
    const card = document.createElement("div");
    card.className = "order-card";

    const heading = document.createElement("h3");
    heading.textContent = `Order ID: ${order.orderId || "N/A"}`;
    card.appendChild(heading);

    const date = document.createElement("p");
    date.textContent = `Order Date: ${
        order.orderDate
            ? new Date(order.orderDate).toLocaleString()
            : "Not available"
    }`;
    card.appendChild(date);

    const status = document.createElement("p");
    status.className = "order-status";
    status.textContent = `Status: ${order.status || "Placed"}`;
    card.appendChild(status);

    const total = document.createElement("p");
    total.textContent = `Total Amount: ₹${order.total || 0}`;
    card.appendChild(total);

    const productsSection = document.createElement("div");
    productsSection.className = "order-products";

    const productsHeading = document.createElement("h4");
    productsHeading.textContent = "Products:";
    productsSection.appendChild(productsHeading);

    (order.items || []).forEach(item => {
        const product = document.createElement("p");
        product.textContent =
            `${item.name} × ${item.quantity} - ₹${item.price * item.quantity}`;

        productsSection.appendChild(product);
    });

    card.appendChild(productsSection);
    ordersList.appendChild(card);
}

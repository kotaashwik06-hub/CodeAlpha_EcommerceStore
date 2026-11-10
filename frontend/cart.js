
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<h3>Your cart is empty!</h3>";
        cartTotal.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div>
                <h3>${item.name}</h3>
                <p>Price: ₹${item.price}</p>
                <p>Quantity: ${item.quantity}</p>

                <button onclick="changeQuantity(${index}, -1)">
                    -
                </button>

                <button onclick="changeQuantity(${index}, 1)">
                    +
                </button>

                <button onclick="removeItem(${index})">
                    Remove
                </button>
            </div>

            <h3>₹${itemTotal}</h3>
        `;

        cartItems.appendChild(div);
    });

    cartTotal.textContent = total;
}


function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
}

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
}

function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

document.getElementById("checkoutBtn")
    .addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        window.location.href = "checkout.html";
    });

displayCart();

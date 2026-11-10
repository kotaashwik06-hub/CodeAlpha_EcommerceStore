
// Check logged-in user
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

const guestLinks = document.getElementById("guestLinks");
const registerLink = document.getElementById("registerLink");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const logoutLink = document.getElementById("logoutLink");

if (token && userData) {
    const user = JSON.parse(userData);

    guestLinks.style.display = "none";
    registerLink.style.display = "none";

    userInfo.style.display = "list-item";
    logoutLink.style.display = "list-item";

    userName.textContent = user.name;
}

// Logout functionality
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("You have logged out successfully!");

        window.location.href = "index.html";
    });
}

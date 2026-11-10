
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login before proceeding to checkout.");
    window.location.href = "login.html";
}

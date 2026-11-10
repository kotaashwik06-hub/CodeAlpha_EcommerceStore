
const API_URL = "http://localhost:5001/api/auth";

// REGISTER USER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        if (name.length < 2) {
            message.textContent = "Please enter a valid name.";
            message.style.color = "red";
            return;
        }

        if (password.length < 8) {
            message.textContent =
                "Password must contain at least 8 characters.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.style.color = "red";
            return;
        }

        message.textContent = "Registering...";
        message.style.color = "blue";

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            message.textContent =
                "Registration successful! Redirecting to login...";
            message.style.color = "green";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            message.textContent = error.message;
            message.style.color = "red";
        }
    });
}


// LOGIN USER
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        if (!email || !password) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        message.textContent = "Logging in...";
        message.style.color = "blue";

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save login information (never save the password)
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            message.textContent = "Login successful! Redirecting...";
            message.style.color = "green";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } catch (error) {
            message.textContent = error.message;
            message.style.color = "red";
        }
    });
}

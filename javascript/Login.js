const samInput = document.getElementById("samID");

samInput.addEventListener("blur", () => {
    let value = samInput.value.trim();

    // Only process if user typed something
    if (value !== "") {
        value = value.replace(/\D/g, "");
        value = value.padStart(9, "0");
        samInput.value = value;
    }
});

const passwordInput = document.querySelector("input[name='password']");
const showIcon = document.getElementById("show");
const hideIcon = document.getElementById("hide");

showIcon.addEventListener("click", () => {
    passwordInput.type = "text";
    showIcon.classList.add("hide");
    hideIcon.classList.remove("hide");
});

hideIcon.addEventListener("click", () => {
    passwordInput.type = "password";
    hideIcon.classList.add("hide");
    showIcon.classList.remove("hide");
});

const loginForm = document.getElementById("login-form");
const samIdInput = document.getElementById("samID");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    
    loginError.textContent = "";

    const samID = samIdInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ samID, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert(data.message);
            
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'Tutor') {
                window.location.href = '/Availability.html'; // (Assuming this page exists)
            } else {
                window.location.href = '/Booking-select.html'; // (Assuming this page exists)
            }
            
        } else {
            loginError.textContent = data.message || "Login failed. Please try again.";
        }

    } catch (error) {
        console.error("Login error:", error);
        loginError.textContent = "An unexpected error occurred. Please try again.";
    }
});
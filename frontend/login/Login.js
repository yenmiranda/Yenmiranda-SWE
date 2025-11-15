//login front end logic

const samInput = document.getElementById("samID");

samInput.addEventListener("blur", () => {
    let value = samInput.value.trim();
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

//runs login form
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    loginError.style.display = 'none';
    
    const samID = samIdInput.value;
    const password = passwordInput.value;

    //api call
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ samID: samID, password: password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            sessionStorage.setItem('userData', JSON.stringify(data.user));
            
            alert(data.message);
            
            if (data.user.role === 'Tutor') {
                window.location.href = 'Availability.html';
            } else {
                window.location.href = 'Booking-select.html'; 
            }

        } else {
            loginError.textContent = data.message;
            loginError.style.display = 'block';
        }

    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'An error occurred. Please try again.';
        loginError.style.display = 'block';
    }
});
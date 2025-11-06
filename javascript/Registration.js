const passwordInputs = document.querySelectorAll("input[type='password']");
const showIcons = document.querySelectorAll(".fa-eye");
const hideIcons = document.querySelectorAll(".fa-eye-slash");

// show password
showIcons.forEach((showIcon, index) => {
    showIcon.addEventListener("click", () => {
        passwordInputs[index].type = "text";
        hideIcons[index].classList.remove("hide");
        showIcon.classList.add("hide");
    });
});

// hide password
hideIcons.forEach((hideIcon, index) => {
    hideIcon.addEventListener("click", () => {
        passwordInputs[index].type = "password";
        showIcons[index].classList.remove("hide");
        hideIcon.classList.add("hide");
    });
});

//function to drop-downs
document.addEventListener("DOMContentLoaded", function() {
    const roleSelect = document.getElementById('roleSelect');
    const courseSelect = document.getElementById('courseSelect');

    roleSelect.addEventListener('change', function() {
        if (this.value === 'tutor') {
            // show course dropdown
            courseSelect.style.display = 'block';
            courseSelect.required = true;
        } else {
            // hide course dropdown
            courseSelect.style.display = 'none';
            courseSelect.required = false;
            courseSelect.value = ''; // clear selection
        }
    });
});
//validation of password,making sure they match
const form = document.querySelector("form");
const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");

form.addEventListener("submit", function(e) {
    // Check if passwords match
    if (password1.value !== password2.value) {
        e.preventDefault(); // Prevent form submission
        alert("Passwords do not match! Please try again.");
        password2.focus(); // Focus on confirm password field
        return false;
    }
});

// Create a message element for live feedback
const msg1 = document.createElement("p");
msg1.style.fontSize = "12px";
msg1.style.color = "red";
msg1.style.marginTop = "5px";
// Append it below password1 input
password1.parentNode.appendChild(msg1);

// Live validation for password strength
password1.addEventListener("input", () => {
    const value = password1.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,15}$/;

    if (!regex.test(value)) {
        password1.style.borderColor = "red";
        msg1.textContent = "Password must be 8-15 chars, include uppercase, lowercase, number & special char";
    } else {
        password1.style.borderColor = "green";
        msg1.textContent = "";
    }
});
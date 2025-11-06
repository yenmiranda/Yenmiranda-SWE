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

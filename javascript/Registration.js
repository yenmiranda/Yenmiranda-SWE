// Select only the password input and icons
let inputEl = document.querySelector("#password1");
let showEl = document.querySelector(".fa-eye");
let hideEl = document.querySelector(".fa-eye-slash");

// When clicking the "show" icon
showEl.addEventListener("click", () => {
    inputEl.type = "text";
    hideEl.classList.remove("hide");
    showEl.classList.add("hide");
});

// When clicking the "hide" icon
hideEl.addEventListener("click", () => {
    inputEl.type = "password";
    hideEl.classList.add("hide");
    showEl.classList.remove("hide");
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

// Select only the password input and icons
let inputEl = document.querySelector("#password");
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

//function to sropdowns
// Wait until the page is fully loaded
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

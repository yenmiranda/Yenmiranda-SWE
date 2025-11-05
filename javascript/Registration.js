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

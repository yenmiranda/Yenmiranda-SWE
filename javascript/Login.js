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

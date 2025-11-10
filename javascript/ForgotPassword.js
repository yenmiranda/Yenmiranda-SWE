// toggle between eye and eye-slash
const passwordFields = [
    document.getElementById("securityKey"),
    document.getElementById("password1"),
    document.getElementById("password2")
];

const showIcons = [
    document.getElementById("show"),
    document.getElementById("show1"),
    document.getElementById("show2")
];

const hideIcons = [
    document.getElementById("hide"),
    document.getElementById("hide1"),
    document.getElementById("hide2")
];

// show/hide password
showIcons.forEach((icon, i) => {
    icon.addEventListener("click", () => {
        passwordFields[i].type = "text";
        icon.classList.add("hide");
        hideIcons[i].classList.remove("hide");
    });
});

hideIcons.forEach((icon, i) => {
    icon.addEventListener("click", () => {
        passwordFields[i].type = "password";
        icon.classList.add("hide");
        showIcons[i].classList.remove("hide");
    });
});

//toggles between the forgot password and reset password
const forgotBtn = document.querySelector("button[name='forgotPassword']");
forgotBtn.addEventListener("click", () => {
    document.getElementById("forgotPasswordBox").style.display = "none";
    document.getElementById("resetpasswordBox").style.display = "block";
});

//password validation
function valid() {
    const pass1 = document.getElementById("password1").value;
    const pass2 = document.getElementById("password2").value;
    const message = document.getElementById("message");

    if (pass1 === "" && pass2 === "") {
        message.textContent = "";
    } else if (pass1 === pass2) {
        message.style.color = "green";
        message.textContent = "Passwords match";
    } else {
        message.style.color = "red";
        message.textContent = "Passwords do not match";
    }
}



//validates passwords to match
const resetForm = document.querySelector("#resetpasswordBox form");
if (resetForm) {
    resetForm.addEventListener("submit", (e) => {
        const pass1 = document.getElementById("password1").value;
        const pass2 = document.getElementById("password2").value;
        if (pass1 !== pass2) {
            e.preventDefault();
            alert("Passwords do not match!");
        }
    });
}

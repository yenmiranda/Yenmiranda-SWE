//forgot password logic

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

showIcons.forEach((icon, i) => {
    if (!icon) return;
    icon.addEventListener("click", () => {
        passwordFields[i].type = "text";
        icon.classList.add("hide");
        hideIcons[i].classList.remove("hide");
    });
});

hideIcons.forEach((icon, i) => {
    if (!icon) return;
    icon.addEventListener("click", () => {
        passwordFields[i].type = "password";
        icon.classList.add("hide");
        showIcons[i].classList.remove("hide");
    });
});

const forgotBtn = document.querySelector("button[name='forgotPassword']");

//runs forgot password button 
forgotBtn.addEventListener("click", async () => {
    const samID = document.getElementById("samID").value.trim();
    const securityKey = document.getElementById("securityKey").value.trim();

    if (!samID || !securityKey) {
        alert("Please enter both your SAM ID and Security Key.");
        return;
    }

    //api call
    try {
        const response = await fetch('/api/auth/verify-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ samID: samID, securityKey: securityKey })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById("forgotPasswordBox").style.display = "none";
            document.getElementById("resetpasswordBox").style.display = "block";
        } else {
            alert(`Verification failed: ${result.message}`);
        }
    } catch (error) {
        console.error("Error during key verification:", error);
        alert("A network error occurred. Please try again.");
    }
});

//validation function
function valid() {
    const pass1 = document.getElementById("password1").value;
    const pass2 = document.getElementById("password2").value;
    const message = document.getElementById("message");
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,25}$/;
    const strengthMessage = "Password must be 8-25 chars, include uppercase, lowercase, number & special char";

    if (pass1 === "" && pass2 === "") {
        message.textContent = ""; return;
    }
    if (!regex.test(pass1)) {
        message.style.color = "red";
        message.textContent = strengthMessage;
    } else {
        message.style.color = "green";
        if (pass2 === "") message.textContent = "";
        else if (pass1 === pass2) message.textContent = "Passwords match";
        else {
            message.style.color = "red";
            message.textContent = "Passwords do not match";
        }
    }
}

document.getElementById("password1").addEventListener('keyup', valid);
document.getElementById("password2").addEventListener('keyup', valid);

const samInput = document.getElementById("samID");

//blur function
samInput.addEventListener("blur", () => {
    let value = samInput.value.trim();
    if (value !== "") {
        value = value.replace(/\D/g, "");
        value = value.padStart(9, "0");
        samInput.value = value;
    }
});

const resetBtn = document.querySelector("button[name='resetPassword']");
const message = document.getElementById("message"); 

//reset button 
resetBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    
    const samID = document.getElementById("samID").value.trim(); 
    const pass1 = document.getElementById("password1").value;
    const pass2 = document.getElementById("password2").value;

    if (pass1 !== pass2) {
        message.textContent = "Passwords do not match";
        message.style.color = "red";
        return;
    }
    
    //api call
    try {
        
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                samID: samID,
                newPassword: pass1,
                confirmPassword: pass2
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.href = 'Login.html';
        } else {
            message.textContent = result.message;
            message.style.color = "red";
        }
    } catch (error) {
        console.error("Error during password reset:", error);
        message.textContent = "A network error occurred. Please try again.";
        message.style.color = "red";
    }
});
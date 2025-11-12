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
/*Validating matched passwords*/
function valid(){
    var password1 = document.getElementById('password1').value;
    var password2 = document.getElementById('password2').value;
    var message = document.getElementById('message');

    if(password1 ==''){
        message.innerHTML = 'Please Enter Password';
    }
    else if(password2 ==''){
        message.innerHTML='Please Enter Confirm-password';
    }
    else if (password1 != password2){
        message.innerHTML='Password does not match';
        message.style.color = 'red';
    }
    else{
        message.innerHTML='Password Matched';
        message.style.color = 'green';
    }
}//ends finction

const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");

// Create a message element for live feedback
const msg1 = document.createElement("p");
msg1.style.fontSize = "12px";
msg1.style.color = "red";
msg1.style.marginTop = "5px";
// Append it below password1 input
document.getElementById("password1-error").appendChild(msg1);

// Live validation for password strength
password1.addEventListener("input", () => {
    const value = password1.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,25}$/;

    if (!regex.test(value)) {
        password1.style.borderColor = "red";
        msg1.textContent = "Password must be 8-25 chars, include uppercase, lowercase, number & special char";
    } else {
        password1.style.borderColor = "green";
        msg1.textContent = "";
    }
});
//adds padding of 0's for sam id
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

const registerForm = document.querySelector("#register-form form");

registerForm.addEventListener("submit", async (event) => {
    
    event.preventDefault();

    const firstName = registerForm.elements.firstName.value;
    const surname = registerForm.elements.surname.value;
    const samID = registerForm.elements.samID.value;
    const password = registerForm.elements.password1.value;
    const password2 = registerForm.elements.password2.value;
    const securityKey = registerForm.elements.security_key.value;
    const roleValue = registerForm.elements.roleSelect.value; 
    const courseValue = document.getElementById('courseSelect').value;

    if (password !== password2) {
        document.getElementById('message').innerHTML = 'Passwords do not match';
        document.getElementById('message').style.color = 'red';
        return; 
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,25}$/;
    if (!regex.test(password)) {
        document.getElementById('password1-error').textContent = "Password must be 8-25 chars, include uppercase, lowercase, number & special char";
        return; 
    }

    const roleToSend = (roleValue === 'tutor') ? 'Tutor' : 'Tutee';

    const formData = {
        firstName: firstName,
        surname: surname,
        samID: samID,
        password: password,
        securityKey: securityKey,
        role: roleToSend,
        course: courseValue || null
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Registration successful! You will now be redirected to the login page.");
            window.location.href = 'Login.html';
        } else {
            alert(`Registration failed: ${result.message}`);
        }

    } catch (error) {
        console.error("Error during registration:", error);
        alert("A network error occurred. Please try again.");
    }
});
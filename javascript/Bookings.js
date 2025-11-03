
function showTuteeSection() { //shows tutee section, hides role select
    document.getElementById('role-selector').style.display = 'none';
    document.getElementById('tutee-section').style.display = 'block';
}


function showTutorSection() { //shows tutor availability
    window.location.href = 'Availability.html';
}

function resetForm() { //resets form after successful submission
    document.getElementById('confirmation-message').style.display = 'none';
    document.getElementById('booking-form').style.display = 'block';
    document.getElementById('booking-form').reset();
}

document.addEventListener('DOMContentLoaded', (event) => { //waits for page load, attaches submission handler to form
    
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        
        bookingForm.addEventListener('submit', function(e) {
            
            //prevent reload
            e.preventDefault(); 

            //form data
            const tutor = document.getElementById('tutor-select').value;
            const day = document.getElementById('day-select').value;
            const time = document.getElementById('time-select').value;

            const bookingData = {
                tutor: tutor,
                day: day,
                time: time
            };

            //sends to backend
            fetch('http://localhost:3000/api/book-appointment', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(bookingData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    bookingForm.style.display = 'none';
                    document.getElementById('confirmation-message').style.display = 'block';
                } else {
                    alert('Booking failed: ' + data.message);
                }
            })
            .catch(error => {
                //network errors
                console.error('Fetch error:', error);
                alert('Could not connect to the booking server. Please try again later.');
            });
        });
    }
});

// LOGOUT FUNCTIONALITY
// Handles user logout - clears session data and redirects to login page

// FUNCTION: Handle logout button click
function handleLogout() {
    // Clear all session data
    sessionStorage.clear();
    // Removes all saved booking data from browser session storage
    
    // Optional: Also clear localStorage if you're using it
    // localStorage.clear();
    
    // Redirect to login page
    window.location.href = 'login.html';
    // Change 'login.html' to whatever your login page is called
    // Could also be: 'index.html', 'signin.html', etc.
}
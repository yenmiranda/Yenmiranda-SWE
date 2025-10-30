
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
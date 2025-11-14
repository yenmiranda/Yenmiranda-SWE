let CURRENT_USER = null;
let DAY_AVAILABILITY = []; 

//html elements
const courseSelect = document.getElementById('course-select');
const dateSelect = document.getElementById('date-select');
const timeSelect = document.getElementById('time-select');
const checkAvailabilityBtn = document.getElementById('check-availability-btn');
const continueBtn = document.getElementById('continue-btn');
const availabilityResult = document.getElementById('availability-result');
const availableMessage = document.getElementById('available-message');
const unavailableMessage = document.getElementById('unavailable-message');
const tutorCount = document.getElementById('tutor-count');
const unavailableTime = document.getElementById('unavailable-time');
const alternativeTimes = document.getElementById('alternative-times');
const selectionForm = document.getElementById('selection-form');

//date picker
function setupDatePicker() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;
    
    dateSelect.min = todayFormatted;
    
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxYear = maxDate.getFullYear();
    const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDate.getDate()).padStart(2, '0');
    dateSelect.max = `${maxYear}-${maxMonth}-${maxDay}`;
}

//updates avail time slots
function updateAvailableTimeSlots() {
    const selectedDate = dateSelect.value;
    if (!selectedDate) return;

    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const currentHour = today.getHours();
    const timeOptions = timeSelect.querySelectorAll('option');

    timeOptions.forEach(option => {
        if (option.value === '') return;
        const startHour = parseInt(option.value.split(':')[0]);

        if (selectedDate === todayFormatted && startHour <= currentHour) {
            option.disabled = true;
            option.style.color = '#999';
        } else {
            option.disabled = false;
            option.style.color = '';
        }
    });

    const currentSelection = timeSelect.value;
    if (currentSelection) {
        const selectedStartHour = parseInt(currentSelection.split(':')[0]);
        if (selectedDate === todayFormatted && selectedStartHour <= currentHour) {
            timeSelect.value = '';
            resetAvailabilityCheck();
        }
    }
}

//form validation
function checkFormComplete() {
    const course = courseSelect.value;
    const date = dateSelect.value;
    const time = timeSelect.value;

    if (course && date && time) {
        checkAvailabilityBtn.style.display = 'block';
    } else {
        checkAvailabilityBtn.style.display = 'none';
    }
}

//more form validation
function resetAvailabilityCheck() {
    availabilityResult.style.display = 'none';
    continueBtn.style.display = 'none';
    availableMessage.style.display = 'none';
    unavailableMessage.style.display = 'none';
    DAY_AVAILABILITY = []; 
    checkFormComplete();
}

// fetches all open slots for a given course and date
async function checkTutorAvailability(course, date) {
    try {
        const response = await fetch(`/api/availability/open?classNo=${course}&date=${date}`);
        if (!response.ok) {
            throw new Error('Failed to fetch availability.');
        }
        const slots = await response.json();
        DAY_AVAILABILITY = slots;
        console.log(`Fetched ${slots.length} open slots for ${date}`);
        return true;

    } catch (error) {
        console.error('Error checking availability:', error);
        availabilityResult.innerHTML = '<p class="error-message">Could not fetch availability. Please try again.</p>';
        availabilityResult.style.display = 'block';
        DAY_AVAILABILITY = [];
        return false;
    }
}

function formatTimeDisplay(timeSlot) {
    const [start, end] = timeSlot.split('-');
    const startHour = parseInt(start.split(':')[0]);
    const startFormatted = startHour === 0 ? '12:00 AM' :
                          startHour < 12 ? `${startHour}:00 AM` :
                          startHour === 12 ? '12:00 PM' :
                          `${startHour - 12}:00 PM`;
    
    const endHour = parseInt(end.split(':')[0]);
    const endFormatted = endHour === 0 ? '12:00 AM' :
                        endHour < 12 ? `${endHour}:00 AM` :
                        endHour === 12 ? '12:00 PM' :
                        `${endHour - 12}:00 PM`;
    
    return `${start} - ${end} (${startFormatted} - ${endFormatted})`;
}

//filters the DAY_AVAILABILITY cache for nearby times
function findAlternativeTimes(selectedTime) {
    const alternatives = new Map(); 
    const selectedStartHour = parseInt(selectedTime.split(':')[0]);

    DAY_AVAILABILITY.forEach(slot => {
        const slotTime = new Date(slot.TimeSlot);
        const slotStartHour = slotTime.getHours();
        
        if (slotStartHour !== selectedStartHour && Math.abs(slotStartHour - selectedStartHour) <= 2) {
            const timeSlotValue = `${String(slotStartHour).padStart(2, '0')}:00-${String(slotStartHour + 1).padStart(2, '0')}:00`;
            
            if (!alternatives.has(timeSlotValue)) {
                alternatives.set(timeSlotValue, { time: timeSlotValue, tutorCount: 0 });
            }
            alternatives.get(timeSlotValue).tutorCount++;
        }
    });
    
    return Array.from(alternatives.values());
}

//fetches and displays students upcoming appointments
async function loadStudentAppointments() {
    const listContainer = document.querySelector('.appointments-list');
    listContainer.innerHTML = '<p>Loading your appointments...</p>';

    try {
        const response = await fetch(`/api/bookings/student`);
        if (!response.ok) {
            if (response.status === 401) handleLogout();
            throw new Error('Failed to fetch');
        }

        const appointments = await response.json();

        if (appointments.length === 0) {
            listContainer.innerHTML = `
                <div class="no-appointments">
                    <p>You don't have any upcoming appointments yet.</p>
                    <p>Book your first session above!</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = ''; 
        appointments.forEach(appt => {
            const dt = new Date(appt.TimeSlot);
            const date = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const startTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const endDate = new Date(dt.getTime() + 60 * 60 * 1000); 
            const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const timeRange = `${startTime} - ${endTime}`;

            const card = document.createElement('div');
            card.className = 'appointment-card';
            card.dataset.bookingNo = appt.BookingNo; 
            
            card.innerHTML = `
                <div class="appointment-header">
                    <span class="appointment-course">${appt.ClassName}</span>
                    <span class="appointment-date">${date}</span>
                </div>
                <div class="appointment-details">
                    <p class="appointment-time">${timeRange}</p>
                    <p class="appointment-tutor">Tutor: ${appt.TutorFirstName} ${appt.TutorLastName}</p>
                    <p class="appointment-location">Location: AB1 210</p>
                </div>
                <div class="appointment-actions">
                    <button class="cancel-btn">Cancel</button>
                </div>
            `;
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to load appointments:', error);
        listContainer.innerHTML = '<p class="error-message">Could not load your appointments.</p>';
    }
}

//booking cancellation 
async function cancelBooking(bookingNo) {
    if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    try {
        const response = await fetch(`/api/bookings/${bookingNo}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            // Reload the appointments list
            loadStudentAppointments(); 
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Cancel error:', error);
        alert('An error occurred. Please try again.');
    }
}

courseSelect.addEventListener('change', resetAvailabilityCheck);
dateSelect.addEventListener('change', () => {
    updateAvailableTimeSlots();
    resetAvailabilityCheck();
});
timeSelect.addEventListener('change', resetAvailabilityCheck);

checkAvailabilityBtn.addEventListener('click', async () => {
    const course = courseSelect.value;
    const date = dateSelect.value;
    const time = timeSelect.value;

    const success = await checkTutorAvailability(course, date);
    if (!success) return; 

    const selectedStartHour = parseInt(time.split(':')[0]);
    
    const availableTutorsForSlot = DAY_AVAILABILITY.filter(slot => {
        const slotTime = new Date(slot.TimeSlot);
        return slotTime.getHours() === selectedStartHour;
    });

    availabilityResult.style.display = 'block';
    
    if (availableTutorsForSlot.length > 0) {
        availableMessage.style.display = 'flex';
        unavailableMessage.style.display = 'none';
        tutorCount.textContent = availableTutorsForSlot.length;
        continueBtn.style.display = 'block';
        sessionStorage.setItem('availableTutors', JSON.stringify(availableTutorsForSlot));
    } else {
        availableMessage.style.display = 'none';
        unavailableMessage.style.display = 'flex';
        unavailableTime.textContent = formatTimeDisplay(time);
        continueBtn.style.display = 'none';
        sessionStorage.removeItem('availableTutors');

        const alternatives = findAlternativeTimes(time);
        alternativeTimes.innerHTML = '';

        if (alternatives.length > 0) {
            alternatives.forEach(alt => {
                const button = document.createElement('button');
                button.className = 'alt-time-btn';
                button.textContent = `${formatTimeDisplay(alt.time)} (${alt.tutorCount} tutor${alt.tutorCount > 1 ? 's' : ''})`;
                button.onclick = () => {
                    timeSelect.value = alt.time;
                    checkAvailabilityBtn.click();
                };
                alternativeTimes.appendChild(button);
            });
        } else {
            alternativeTimes.innerHTML = '<p>No nearby times available. Please try a different date.</p>';
        }
    }
});

selectionForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const bookingData = {
        course: courseSelect.value,
        courseName: courseSelect.options[courseSelect.selectedIndex].text,
        date: dateSelect.value,
        time: timeSelect.value,
        tutorCount: tutorCount.textContent
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = 'booking-confirm.html';
});

//logout
async function handleLogout() { 
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error("Error logging out:", error);
    } finally {
        sessionStorage.clear();
        window.location.href = 'Login.html';
    }
}

//page initialization
window.addEventListener('DOMContentLoaded', () => {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        alert("You are not logged in.");
        window.location.href = 'Login.html';
        return;
    }
    CURRENT_USER = JSON.parse(userData);

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    setupDatePicker();
    updateAvailableTimeSlots();
    checkFormComplete();
    loadStudentAppointments();

    const listContainer = document.querySelector('.appointments-list');
    listContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('cancel-btn')) {
            const card = event.target.closest('.appointment-card');
            const bookingNo = card.dataset.bookingNo;
            if (bookingNo) {
                cancelBooking(bookingNo);
            }
        }
    });
});

// MODAL FUNCTIONALITY
function updateViewAllButton(totalAppointments) {
    const viewAllBtn = document.getElementById('viewAllBtn');
    const totalCount = document.getElementById('totalCount');
    
    if (totalAppointments > 2) {
        viewAllBtn.classList.add('show');
        viewAllBtn.style.display = 'block';
        totalCount.textContent = totalAppointments;
    } else {
        viewAllBtn.classList.remove('show');
        viewAllBtn.style.display = 'none';
    }
}

function openModal() {

    renderModalAppointments();
    
    document.getElementById('appointmentsModal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    document.getElementById('appointmentsModal').classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function closeModalOutside(event) {
    if (event.target === event.currentTarget) {
        closeModal();
    }
}

function renderModalAppointments() {
    const modalList = document.getElementById('modalAppointmentsList');
    const modalCount = document.getElementById('modalCount');
    
    const appointments = []; 
    
    modalCount.textContent = appointments.length;
    modalList.innerHTML = '';
    
    appointments.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'modal-appointment-card';
        card.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-course">${apt.course}</div>
                <div class="appointment-date">${apt.date}</div>
            </div>
            <div class="appointment-details">
                <p><strong>Time:</strong> ${apt.time}</p>
                <p><strong>Tutor:</strong> ${apt.tutor}</p>
                <p><strong>Location:</strong> ${apt.location}</p>
            </div>
            <div class="appointment-actions">
                <button class="cancel-btn" onclick="cancelAppointment(${apt.id})">Cancel Appointment</button>
            </div>
        `;
        modalList.appendChild(card);
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
